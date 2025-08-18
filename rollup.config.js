import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.ts",
  external: ['qrcode','jimp'],
  output: [
    {
      file: "dist/smart-upiqr.umd.js",
      format: "umd",
      name: "smartupiqr",
      sourcemap: true,
      globals: {
        qrcode: 'QRCode',
        jimp: 'Jimp'
      }
    },
    {
      file: "dist/smart-upiqr.umd.min.js",
      format: "umd",
      name: "smartupiqr",
      sourcemap: true,
      plugins: [terser()],
      globals: {
        qrcode: 'QRCode',
        jimp: 'Jimp'
      }
    },
  ],
  plugins: [typescript()],
};
