// index.ts

// --- Imports ---
// qrcode is always required
import * as QRCode from "qrcode";

// Lazy import for canvas (only used in Node.js)
let nodeCanvas: any;
function getNodeCanvas() {
  if (!nodeCanvas) {
    nodeCanvas = require("canvas");
  }
  return nodeCanvas;
}

// --- Types ---
export interface UPILinkOptions {
  PayeeUPI: string;
  PayeeName: string;
  Amount: number;
  TransactionNote?: string;
  MerchantCode?: string;
  TransactionRef?: string;
  TransactionId?: string;
  GST?: { Total?: number; CGST?: number; SGST?: number; IGST?: number };
  invoiceNo?: string;
  invoiceDate?: boolean;
  QrExpireDays?: number;
  QrTimestamp?: boolean;
  GSTno?: string;
}

export interface UPIQROptions extends UPILinkOptions {
  logo?: string;
  logoSize?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

// --- Utilities ---
const formatDateIsoWithOffset = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const tzMinutes = pad(Math.abs(tzOffset) % 60);

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    sign +
    tzHours +
    ":" +
    tzMinutes
  );
};

// --- UPI Link Generator ---
export function UPILink(options: UPILinkOptions): string {
  const {
    PayeeUPI,
    PayeeName,
    Amount,
    TransactionNote,
    MerchantCode,
    TransactionRef,
    TransactionId,
    GST,
    invoiceNo,
    invoiceDate,
    QrExpireDays,
    QrTimestamp,
    GSTno,
  } = options;

  if (!PayeeUPI || !PayeeName || !Amount) {
    throw new Error(
      `"PayeeUPI", "PayeeName", "Amount > 0" is required. Received --> PayeeUPI: ${PayeeUPI} | PayeeName: ${PayeeName} | Amount: ${Amount}`
    );
  }

  if (isNaN(Amount) || Amount <= 0) {
    throw new Error(`"Amount" must be number > 0. Received: ${Amount}`);
  }

  if (
    (GST?.Total && (isNaN(GST.Total) || GST.Total < 0)) ||
    (GST?.CGST && (isNaN(GST.CGST) || GST.CGST < 0)) ||
    (GST?.SGST && (isNaN(GST.SGST) || GST.SGST < 0)) ||
    (GST?.IGST && (isNaN(GST.IGST) || GST.IGST < 0))
  ) {
    throw new Error(
      `"Total/CGST/SGST/IGST" must be number >=0 . Received: ${GST}`
    );
  }

  if (QrExpireDays && (isNaN(QrExpireDays) || QrExpireDays <= 0)) {
    throw new Error(
      `"QrExpireDays" must be number > 0 for Future expiry. Received: ${QrExpireDays}`
    );
  }

  const now = new Date();

  let upi = `upi://pay?pa=${encodeURIComponent(
    PayeeUPI
  )}&pn=${encodeURIComponent(PayeeName)}&am=${encodeURIComponent(
    Amount
  )}&cu=INR`;

  if (TransactionNote) upi += `&tn=${encodeURIComponent(TransactionNote)}`;
  if (MerchantCode) upi += `&mc=${encodeURIComponent(MerchantCode)}`;
  if (TransactionRef) upi += `&tr=${encodeURIComponent(TransactionRef)}`;
  if (TransactionId) upi += `&tid=${encodeURIComponent(TransactionId)}`;
  if (invoiceNo) upi += `&invoiceNo=${encodeURIComponent(invoiceNo)}`;
  if (GST)
    upi += `&gstBrkUp=${encodeURIComponent(
      `GST:${GST.Total}|CGST:${GST.CGST}|SGST:${GST.SGST}|IGST:${GST.IGST}`
    )}`;

  if (invoiceDate) upi += `&invoiceDate=${encodeURIComponent(formatDateIsoWithOffset(now))}`;
  if (QrTimestamp) upi += `&QRts=${encodeURIComponent(formatDateIsoWithOffset(now))}`;

  if (QrExpireDays) {
    const expireDate = new Date(now.getTime() + QrExpireDays * 86400000);
    upi += `&QRexpire=${encodeURIComponent(formatDateIsoWithOffset(expireDate))}`;
  }

  if (GSTno) upi += `&gstIn=${encodeURIComponent(GSTno)}`;

  return upi;
}

// --- Browser/Node detection ---
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

// --- UPI QR Generator ---
export async function UPIQR(options: UPIQROptions): Promise<string | null> {
  const link = UPILink(options);
  if (!link) return null;

  // Browser path
  if (isBrowser()) {
    const qrDataUrl = await QRCode.toDataURL(link, {
      type: "image/png",
      color: {
        dark: options.color?.dark || "#000000",
        light: options.color?.light || "#ffffff",
      },
      margin: 2,
      scale: 8,
    });

    if (options.logo) {
      return new Promise((resolve, reject) => {
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        qrImg.src = qrDataUrl;

        qrImg.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = qrImg.width;
          canvas.height = qrImg.height;

          ctx.drawImage(qrImg, 0, 0);

          const logo = new Image();
          logo.crossOrigin = "anonymous";
          logo.src = options.logo!;

          logo.onload = () => {
            const logoSize = options.logoSize || qrImg.width / 6;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            ctx.drawImage(logo, x, y, logoSize, logoSize);

            resolve(canvas.toDataURL("image/png"));
          };
          logo.onerror = reject;
        };

        qrImg.onerror = reject;
      });
    }

    return qrDataUrl;
  }

  // Node.js path
  const { createCanvas, loadImage } = getNodeCanvas();
  const qrBuffer = await QRCode.toBuffer(link, {
    type: "png",
    color: {
      dark: options.color?.dark || "#000000",
      light: options.color?.light || "#ffffff",
    },
    margin: 2,
    scale: 8,
  });

  if (options.logo) {
    const qrImg = await loadImage(qrBuffer);
    const canvas = createCanvas(qrImg.width, qrImg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(qrImg, 0, 0);

    const logo = await loadImage(options.logo);
    const logoSize = options.logoSize || qrImg.width / 6;
    const x = (canvas.width - logoSize) / 2;
    const y = (canvas.height - logoSize) / 2;

    ctx.drawImage(logo, x, y, logoSize, logoSize);

    return canvas.toDataURL("image/png");
  }

  return `data:image/png;base64,${qrBuffer.toString("base64")}`;
}
