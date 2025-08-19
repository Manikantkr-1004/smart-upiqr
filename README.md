# smart-upiqr

Easily generate branded UPI QR codes and payment links with customizable options for JavaScript and Node.js.

![npm](https://img.shields.io/npm/v/smart-upiqr)
![Node](https://img.shields.io/node/v/smart-upiqr)
![npm downloads](https://img.shields.io/npm/dm/smart-upiqr)
![license](https://img.shields.io/npm/l/smart-upiqr)

## Installation

```bash
npm install smart-upiqr
```
```bash
yarn add smart-upiqr
```
```bash
pnpm add smart-upiqr
```


## Using SmartUpiQr from a CDN

[smartupiqr is available on jsDelivr](https://www.jsdelivr.com/package/npm/smart-upiqr) and [unpkg](https://unpkg.com/browse/smart-upiqr/), so you can use it directly in the browser without installing via npm. Just include the script, and `SmartUpiQr` will be available globally:

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/npm/smart-upiqr/dist/smart-upiqr.umd.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/smart-upiqr/dist/smart-upiqr.umd.min.js"></script>

<!-- Or pin to a specific version -->
<script src="https://cdn.jsdelivr.net/npm/smart-upiqr@1.0.0/dist/smart-upiqr.umd.min.js"></script>
<!-- or -->
<script src="https://unpkg.com/smart-upiqr@1.0.0/dist/smart-upiqr.umd.min.js"></script>

<script>
/*
  ✅ Usage in Vanilla JS
  - UPI link can be used in <a href="..." target="_blank"> so that when clicked on mobile/tablet,
    it opens available UPI apps for payment.
  - UPI QR can be displayed inside an <img> tag so users can scan it with any UPI app.
*/

// Generate UPI payment link
function generateUPILink() {
  const upiLink = smartUPIQr.UPILink({
    PayeeUPI: "test@upi",
    PayeeName: "Smart Demo",
    Amount: 499, // Must be > 0
  });

  console.log("Payment Link:", upiLink);

  // Example: set the link in an anchor tag
  document.querySelector("#upianchor").href = upiLink;
}

// Generate UPI QR code
async function generateUPIQR() {
  try {
    const upiQR = await smartUPIQr.UPIQR({
      PayeeUPI: "test@upi",
      PayeeName: "Smart Demo",
      Amount: 275, // Must be > 0
      logo: "https://example.com/logo.png", // PNG or JPEG (remote/local allowed)
    });

    console.log("UPI QR URL:", upiQR);

    // Example: set the QR image in an <img> tag
    document.querySelector("#upiQrImg").src = upiQR;
  } catch (err) {
    console.error("Error while generating UPI QR:", err);
  }
}

// Example calls
generateUPILink();
generateUPIQR();
</script>

<!-- Example HTML structure -->
<a id="upianchor" target="_blank">Pay Now</a>
<img id="upiQrImg" alt="Scan to Pay via UPI" />

```

## Usage After Installation

### Importing

```javascript
// ES Module
import { UPILink, UPIQR } from "smart-upiqr";

// CommonJS
const { UPILink, UPIQR } = require("smart-upiqr");
```

### Basic Example

```javascript
// Example usage after installing your package from npm
// No need to install or import 'qrcode' separately — it's already bundled

// Generate UPI link (can be used in <a href={upiLink} target="_blank">Pay Now</a>)
generateUPILink();

function generateUPILink() {
  const upiLink = UPILink({
    PayeeUPI: "test@upi",
    PayeeName: "Smart Demo",
    Amount: 499,  // Must be > 0
  });

  console.log("Payment Link:", upiLink);

  // Save in state if using React, or just return/use directly
  setUpiLink(upiLink);
}

// Generate UPI QR (can be used in <img src={upiQR} alt="UPI QR" />)
generateUPIQR();

async function generateUPIQR() {
  try {
    const upiQR = await UPIQR({
      PayeeUPI: "test@upi",
      PayeeName: "Smart Demo",
      Amount: 275, // Must be > 0
      logo: "https://example.com/logo.png", // PNG/JPEG only (remote or local path)
      logoSize: 80,
      color: {
        dark: "#000000", // QR code color
        light: "#FFFFFF" // QR code background
      }
    });

    console.log("Payment QR:", upiQR);

    // Save in state if using React, or return directly
    setUpiQrSrc(upiQR);
  } catch (err) {
    console.error("Error while generating UPIQR:", err);
  }
}

```

## API

### `SmartUpiQr(options)`

Generates a UPIQr / UPILink with flexible options.


| Option     | Type                               | Required | Description                                                                 |
|-----------------|------------------------------------|----------|-----------------------------------------------------------------------------|
| **PayeeUPI**    | `string`                           | Yes      | Payment Receiver (Payee) Person/Business/Merchant UPI ID                                             |
| **PayeeName**   | `string`                           | Yes      | Payment Receiver (Payee) Person/Business/Merchant Name                               |
| **Amount**      | `number`                           | Yes      | Total amount to receive                                                     |
| TransactionNote | `string`                           | No       | Transaction Note (max 50 chracter and can use same Transaction Id)                                                           |
| MerchantCode    | `string`                           | No       | Merchant Code                                                               |
| TransactionRef  | `string`                           | No       | Transaction Reference (Can use same TransactionId)                                                      |
| TransactionId   | `string`                           | No       | Transaction ID (Transaction id of payment or any unique id for reference)                                                             |
| GST             | `{ Total?: number, CGST?: number, SGST?: number, IGST?: number}`                           | No       | GST details if available or want to pass (see below)                                                     |
| invoiceNo       | `string`                           | No       | Invoice number                                                              |
| invoiceDate     | `boolean`                          | No       | Whether to include invoice date (If passed true then automatic add current DateTime)                                            |
| QrExpireDays    | `number`                           | No       | QR Code expiry in days (Pass number values greater than 0 to make QR expirable after that day from now)                                                     |
| QrTimestamp     | `boolean`                          | No       | Whether to add timestamp in QR (If passed true then will automatic add current DateTime)                                             |
| GSTno           | `string`                           | No       | GST Number of business                                                      |
| **logo** (QR Only)       | `string` (URL/local path)                     | No       | Logo image URL like 'https://domain.com/brandlogo.png' or '/person.png' (supported only `PNG` & `JPEG` type)                    |
| **logoSize** (QR Only)   | `number`                      | No       | Logo size value greater than 5-10 for better view                                               |
| **color** (QR Only)      | `{ dark?: string, light?: string}` | No       | QR code hex colors (dark for QR itself: Default #000000 and light for background: Default #FFFFFF)                        |


> **Note:**  
> - Fields marked **(QR Only)** apply only when generating QR images so do not pass these marked option if generating UPI payment link 
> - Required fields: `PayeeUPI`, `PayeeName`, `Amount`. for UPI payment Link and UPI QR code
> - `QrExpireDays` and `TransactionNote` and `GST` doesn't support in all UPI Apps so it might not show after scan so do not worry


## License

MIT
