import QRCode from 'qrcode';
import type { QRCodeResult } from '../types';

export async function generateQRCode(url: string): Promise<QRCodeResult> {
  // High error-correction level ('H') ensures maximum scannability and resistance to distortion.
  // Margin of 2 provides the standard recommended quiet zone around the QR matrix.
  const commonOptions = {
    errorCorrectionLevel: 'H' as const,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  };

  // High-resolution 1024x1024 PNG data URL
  const pngDataUrl = await QRCode.toDataURL(url, {
    ...commonOptions,
    width: 1024,
  });

  // Scalable Vector Graphic (SVG) string
  const svgString = await QRCode.toString(url, {
    ...commonOptions,
    type: 'svg',
  });

  return {
    url,
    pngDataUrl,
    svgString,
  };
}

export function downloadPng(pngDataUrl: string, filename = 'qr-code.png') {
  const link = document.createElement('a');
  link.href = pngDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadSvg(svgString: string, filename = 'qr-code.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}
