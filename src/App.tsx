import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { URLInputForm } from './components/URLInputForm';
import { QRCodePreview } from './components/QRCodePreview';
import { validateUrl } from './utils/url';
import { generateQRCode } from './utils/qr';
import type { QRCodeResult, Theme } from './types';
import './App.css';

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('qr-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [urlInput, setUrlInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<QRCodeResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync theme to DOM & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qr-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleInputChange = (value: string) => {
    setUrlInput(value);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const validation = validateUrl(urlInput);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid URL.');
      return;
    }

    const targetUrl = validation.sanitizedUrl || urlInput.trim();

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await generateQRCode(targetUrl);
      setQrResult(result);
    } catch {
      setErrorMessage('Failed to generate QR code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQrResult(null);
    setUrlInput('');
    setErrorMessage(null);
  };

  // Allow ESC to reset back to form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && qrResult) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [qrResult]);

  return (
    <div className="app-layout">
      <div className="app-container">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main className="main-content">
          <div className="card-surface">
            {!qrResult ? (
              <URLInputForm
                urlInput={urlInput}
                onInputChange={handleInputChange}
                onSubmit={handleGenerate}
                errorMessage={errorMessage}
                isLoading={isLoading}
              />
            ) : (
              <QRCodePreview
                qrResult={qrResult}
                onReset={handleReset}
              />
            )}
          </div>

          <footer className="app-footer">
            <p>
              100% Client-Side • Your URLs never leave your browser • High Error Correction
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
