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
<script src="https://cdn.jsdelivr.net/npm/smart-upiqr/dist/smart-upiqr.umd.min.js"></script> or
<script src="https://unpkg.com/smart-upiqr/dist/smart-upiqr.umd.min.js"></script>

<!-- Or pin to a specific version -->
<script src="https://cdn.jsdelivr.net/npm/smart-upiqr@1.0.0/dist/smart-upiqr.umd.min.js"></script> or
<script src="https://unpkg.com/smart-upiqr@1.0.0/dist/smart-upiqr.umd.min.js"></script>

<script>

// Generate UPI payment link and UPI Qr code in vanilla HTML javascript website
// Generated UPI link use in href attribute in anchor tag with target _blank so when user click on it in tablet or mobile so it'll show all installed UPI Apps and after choose will redirect to that app for payment with that passed values
// Generated UPI QR code url use in img tag with src attribute to show so that anyone can scan via UPI apps for payment

 generateUPILink(); // call the function when need to generate

 function generateUPILink() {
  const upiLink = smartupiqr.UPILink({
    PayeeUPI: "test@upi",
    PayeeName: "Smart Demo",
    Amount: 499,  // Must be greater than 0
  });
  console.log("Payment Link:", upiLink);
  document.querySelector('#upianchor').href = upiLink; // to set link in anchor tag
 }

  generateUPIQR(); // call function when need to generate and show in the UI

  async function generateUPIQR() {
    try{
      const upiQR = await smartupiqr.UPIQR({
        PayeeUPI: "test@upi",
        PayeeName: "Smart Demo",
        Amount: 275, // Must be greater than 0
        logo: "https://example.com/logo.png", // Must be PNG or JPEG format either remote / local url like '/person.png' or '/https://domain.com/photo.png'
      })
      console.log("UPI QR URL", upiQR);
      document.querySelector('#upiQrImg').src = upiQR; // to set url in img tag
    }catch(err) {
      console.error(err, 'Error while generating UPIQR')
    }
  }
</script>
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
// Generate UPI payment link and UPI Qr code in library or framework frontend (to show on mount, use useEffect else call function when needs) or in nodejs backend to send UPI payment links and UPI Qr code through your own API to frontend
// Generated UPI link use in href attribute in anchor tag with target _blank so when user click on it in tablet or mobile so it'll show all installed UPI Apps and after choose will redirect to that app for payment with that passed values
// Generated UPI QR code url use in img tag with src attribute to show so that anyone can scan via UPI apps for payment

 generateUPILink(); // call the function when need to generate

 function generateUPILink() {
  const upiLink = UPILink({
    PayeeUPI: "test@upi",
    PayeeName: "Smart Demo",
    Amount: 499,  // Must be greater than 0
  });
  console.log("Payment Link:", upiLink);
  setUpiLink(upiLink); // or return direct upiLink if needs
 }

  generateUPIQR(); // call the function when need to generate

  async function generateUPIQR() {
    try{
      const upiQR = await UPIQR({
        PayeeUPI: "test@upi",
        PayeeName: "Smart Demo",
        Amount: 275, // Must be greater than 0
        logo: "https://example.com/logo.png", // Must be PNG or JPEG format either remote / local url like '/person.png' or '/https://domain.com/photo.png'
        logoSize: 80,
        color: {
          dark: '#000000', // qrcode itself color
          light: '#FFFFFF' // qrcode background color
        }
      })
      
      // save in useState/useReducer/Redux or any if using React, NextJS etc and start to show via img tag
      setUpiQrSrc(upiQR);
    }catch(err) {
      console.error(err, 'Error while generating UPIQR')
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
| **type** (QR Only)       | `'base64' , 'png' , 'svg'`         | No       | QR code output type (default: `base64`)                           |

> **Note:**  
> - Fields marked **(QR Only)** apply only when generating QR images so do not pass these marked option if generating UPI payment link 
> - Required fields: `PayeeUPI`, `PayeeName`, `Amount`. for UPI payment Link and UPI QR code
> - If you choose `type` svg to generate UPI Qr then logo can't add in the UPI QR code if you have passed it
> - `QrExpireDays` and `TransactionNote` and `GST` doesn't support in all UPI Apps so it might not show after scan so do not worry


## License

MIT
