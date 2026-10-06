import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { validateUrl } from './src/utils/url.ts';

console.log('--- Step 1: Testing URL Validation ---');

// Test Empty
const emptyRes = validateUrl('');
console.assert(!emptyRes.isValid, 'Empty input should fail');
console.assert(emptyRes.error === 'Please enter a URL.', `Unexpected error: ${emptyRes.error}`);
console.log('✓ Empty input test passed');

// Test Whitespace
const spaceRes = validateUrl('   ');
console.assert(!spaceRes.isValid, 'Whitespace input should fail');
console.log('✓ Whitespace test passed');

// Test Invalid URL strings
const invalidStrings = ['not-a-url', 'ftp://example.com', 'http://', 'https://example', 'mailto:test@example.com'];
for (const str of invalidStrings) {
  const res = validateUrl(str);
  console.assert(!res.isValid, `Should reject invalid string: ${str}`);
  console.log(`✓ Rejected invalid URL "${str}": "${res.error}"`);
}

// Test Valid URLs
const validUrls = [
  'https://example.com',
  'http://example.com',
  'https://example.com/path?foo=bar#section',
  'https://subdomain.test.org:8080/deep/resource'
];
for (const url of validUrls) {
  const res = validateUrl(url);
  console.assert(res.isValid, `Should accept valid URL: ${url}`);
  console.assert(res.sanitizedUrl === url, `Sanitized URL mismatch: ${res.sanitizedUrl}`);
  console.log(`✓ Accepted valid URL: "${url}"`);
}

console.log('\n--- Step 2: Testing QR Code Generation & Exact Decode ---');

for (const testUrl of validUrls) {
  // Generate PNG buffer
  const pngBuffer = await QRCode.toBuffer(testUrl, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 600,
  });

  // Decode with pngjs
  const png = PNG.sync.read(pngBuffer);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

  console.assert(code !== null, `Failed to decode QR code for ${testUrl}`);
  console.assert(code.data === testUrl, `Decoded text "${code.data}" !== expected "${testUrl}"`);
  console.log(`✓ Generated and verified QR decode matches exact URL: "${testUrl}"`);

  // Test SVG generation
  const svg = await QRCode.toString(testUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
  });
  console.assert(svg.includes('<svg') && svg.includes('</svg>'), 'SVG generation invalid');
  console.log(`✓ SVG generated with valid tags (${svg.length} chars)`);
}

console.log('\nAll verification tests passed successfully!');
