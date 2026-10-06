# QR Code Generator

A fast, modern, and completely client-side QR Code Generator built with React, TypeScript, and Vite.

## ✨ Features

- **100% Client-Side & Private**: Your URLs never leave your browser. No server or third-party APIs used.
- **Instant Generation**: Generates high-resolution QR codes on the fly.
- **High Scannability**: Uses QR Error Correction Level `H` (up to 30% error tolerance) with proper quiet zone margins.
- **Multi-Format Export**:
  - **Download PNG**: High-resolution 1024×1024 raster image.
  - **Download SVG**: Infinitely scalable vector graphic.
- **Convenient Utilities**:
  - One-click **Copy Link** with instant visual confirmation.
  - Quick **Reset / Generate Another** to enter new URLs seamlessly.
  - Keyboard shortcuts (`Enter` to submit, `Esc` to reset).
- **Modern UI & Theming**:
  - Dark / Light mode toggle with automatic persistence.
  - Responsive, mobile-friendly design with subtle micro-interactions.
  - Form validation with clear error feedback.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/devashish10079/QR-Code-Generator.git

# Navigate into the project directory
cd QR-Code-Generator

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Type-checks and builds the production bundle in `dist/`.
- `npm run lint`: Runs Oxlint.
- `npm run test`: Runs the Vitest integration test suite.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Vanilla CSS with modern custom properties & glassmorphism
- **QR Engine**: `qrcode`
- **Icons**: `lucide-react`
- **Testing**: `vitest`, `@testing-library/react`, `jsdom`, `jsqr`

## 📄 License

MIT
