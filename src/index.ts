import * as QRCode from "qrcode";
import Jimp from "jimp";
const { read, MIME_PNG } = Jimp;

export interface UPILinkOptions {
  PayeeUPI: string; // Payment Receiver (Payee) UPI ID
  PayeeName: string; // Payment Receiver (Payee) Person/Merchant Name
  Amount: number; // Total amount to Receive
  TransactionNote?: string; // Transaction Note
  MerchantCode?: string; // Merchant Code
  TransactionRef?: string; // Transaction Ref
  TransactionId?: string; // Transaction ID
  GST?: {                 // GST Details
    Total?: number;
    CGST?: number;
    SGST?: number;
    IGST?: number;
  }
  invoiceNo?: string; // Invoice Number
  invoiceDate?: boolean; // Invoice Date
  QrExpireDays?: number; // QRCode Expiry Date
  QrTimestamp?: boolean; // QR Code Timestamp
  GSTno?: string; // GST Number of Business
}

export interface UPIQROptions extends UPILinkOptions {
  logo?: string; // Logo image URL and will not work with type svg
  logoSize?: number; // Logo size (px)
  color?: {
    dark?: string;
    light?: string;
  };
  type?: 'base64' | 'png' | 'svg'; // QR code output type, default: base64
}


/**
 * Generate a date formate like : 2025-08-17T16:52:16+05:30
 * @param date - Current new Date() for calculation
 * @returns A formatted expected date like : 2025-08-17T16:52:16+05:30
 */
const formatDateIsoWithOffset = (date: Date) => {
  // Format ISO string with timezone offset
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

/**
 * Generates a UPI payment acceptable link.
 * @param options - Configuration options for UPI payment link.
 * @returns A generated UPI payment url string.
 * @throws {Error} If anything goes wrong.
 */
export function UPILink(options: UPILinkOptions): string {

  const {PayeeUPI, PayeeName, Amount, TransactionNote, MerchantCode, TransactionRef, TransactionId, GST ,invoiceNo, invoiceDate, QrExpireDays, QrTimestamp, GSTno} = options;

  if(!PayeeUPI || !PayeeName || !Amount){
    throw new Error(`"PayeeUPI", "PayeeName", "Amount > 0" is required. Received --> PayeeUPI: ${PayeeUPI} | PayeeName: ${PayeeName} | Amount: ${Amount}`)
  }

  if (isNaN(Amount) || Amount <= 0) {
    throw new Error(`"Amount" must be number > 0. Received: ${Amount}`);
  }
  if ((GST?.Total && (isNaN(GST.Total) || GST.Total < 0)) || (GST?.CGST && (isNaN(GST.CGST) || GST.CGST < 0)) || (GST?.SGST && (isNaN(GST.SGST) || GST.SGST < 0)) || (GST?.IGST && (isNaN(GST.IGST) || GST.IGST < 0))) {
    throw new Error(`"Total/CGST/SGST/IGST" must be number >=0 . Received: ${GST}`);
  }
  if (QrExpireDays && (isNaN(QrExpireDays) || QrExpireDays <= 0)) {
    throw new Error(`"QrExpireDays" must be number > 0 for Future expiry. Received: ${QrExpireDays}`);
  }

  const now = new Date();

  let upi = `upi://pay?pa=${encodeURIComponent(PayeeUPI)}&pn=${encodeURIComponent(PayeeName)}&am=${encodeURIComponent(Amount)}&cu=INR`;

  if (TransactionNote) upi += `&tn=${encodeURIComponent(TransactionNote)}`;
  if (MerchantCode) upi += `&mc=${encodeURIComponent(MerchantCode)}`;
  if (TransactionRef) upi += `&tr=${encodeURIComponent(TransactionRef)}`;
  if (TransactionId) upi += `&tid=${encodeURIComponent(TransactionId)}`;
  if (invoiceNo) upi += `&invoiceNo=${encodeURIComponent(invoiceNo)}`
  if (GST) upi += `&gstBrkUp=${encodeURIComponent(`GST:${GST.Total}|CGST:${GST.CGST}|SGST:${GST.SGST}|IGST:${GST.IGST}`)}`;

  if (invoiceDate) upi += `&invoiceDate=${encodeURIComponent(formatDateIsoWithOffset(now))}`;
  if (QrTimestamp) upi += `&QRts=${encodeURIComponent(formatDateIsoWithOffset(now))}`;

  if (QrExpireDays) {
    const expireDate = new Date(now.getTime() + QrExpireDays * 24 * 60 * 60 * 1000);
    upi += `&QRexpire=${encodeURIComponent(formatDateIsoWithOffset(expireDate))}`;
  }

  if (GSTno) upi += `&gstIn=${encodeURIComponent(GSTno)}`;

  return upi;
}

/**
 * Generates a UPI payment acceptable QR code image URL for scanning.
 * @param options - Configuration options for UPI QR code.
 * @returns A generated UPI QR code image URL (base64 string or svg string) or null if expired.
 * @throws {Error} If anything goes wrong.
 */
export async function UPIQR(options: UPIQROptions): Promise<string | null> {

  const link = UPILink(options);
  if (!link) return null;

  const qrType = options.type || "base64";

  if (qrType === "svg") {
    // SVG generation - logo overlay is NOT supported for SVG
    const svgString = await QRCode.toString(link, {
      type: "svg",
      color: {
        dark: options.color?.dark || "#000000",
        light: options.color?.light || "#ffffff",
      },
      margin: 2,
      scale: 8,
    });
    return svgString;
  }

  // For base64 or PNG type generate buffer
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
    try {

      if (options.logoSize && (isNaN(options.logoSize) || options.logoSize<=5 )) {
        throw new Error(`"logoSize" must be number > 5 for Better view . Received: ${options.logoSize}`);
      }

      const qr = await read(qrBuffer);
      const logo = await read(options.logo);

      const logoSize = options.logoSize ? options.logoSize : qr.bitmap.width / 6;
      logo.resize(logoSize, logoSize);

      const x = qr.bitmap.width / 2 - logo.bitmap.width / 2;
      const y = qr.bitmap.height / 2 - logo.bitmap.height / 2;

      qr.composite(logo, x, y);

      const finalBuffer = await qr.getBufferAsync(MIME_PNG);
      return `data:image/png;base64,${finalBuffer.toString("base64")}`;
    } catch (err) {
      console.error("Error adding logo to QR:", err);
      // Return QR code without logo as fallback
      return `data:image/png;base64,${qrBuffer.toString("base64")}`;
    }
  }

  // No logo case: Return QR code image as per requested default type "base64"
  return `data:image/png;base64,${qrBuffer.toString("base64")}`;
}
