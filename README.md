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

Currently CDN of this package is not available and workable to use. In future it can be available to use in Vanilla website via CDN.

So now you can use it after installation via NPM or Yarn or PNPM

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

// Generate UPI link (can be used in <a href={upiLink} target="_blank">Pay Now</a>)
generateUPILink();

function generateUPILink() {
  const upiLink = UPILink({
    PayeeUPI: "test@upi",
    PayeeName: "Smart Demo",
    Amount: 499,  // Must be > 0
    QrExpireDays: 5 // The QR payment link won't work after 5 days, For more info, read below
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
      QrExpireDays: 10, // The QRcode scan won't work after 10 days, For more info, read below
      logo: "https://example.com/logo.png", // remote or local path like "/logo.png" or "/src/assets/logo.png"
      logoSize: 80,
      color: {
        dark: "#f50baf", // QR code itself color
        light: "#FFFFFF" // QR code background color
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
| **logo** (QR Only)       | `string` (URL/local path)                     | No       | Logo image URL like 'https://domain.com/brandlogo.png' or '/person.png' or 'src/assets/logo.png'                |
| **logoSize** (QR Only)   | `number`                      | No       | Logo size value greater than 5-10 for better view                                               |
| **color** (QR Only)      | `{ dark?: string, light?: string}` | No       | QR code hex colors (dark for QR itself: Default #000000 and light for background: Default #FFFFFF)                        |


> **Note:**  
> - Fields marked **(QR Only)** apply only when generating QR images so do not pass these marked option if generating UPI payment link 
> - Required fields: `PayeeUPI`, `PayeeName`, `Amount`. for UPI payment Link and UPI QR code
> - `QrExpireDays` and `TransactionNote` and `GST` doesn't support in all UPI Apps so it might not show/work after scan so do not worry


## License

MIT
