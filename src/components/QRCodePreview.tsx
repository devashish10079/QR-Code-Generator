import React, { useState } from 'react';
import { Download, Copy, Check, RotateCcw, ExternalLink, Sparkles } from 'lucide-react';
import type { QRCodeResult } from '../types';
import { downloadPng, downloadSvg } from '../utils/qr';

interface QRCodePreviewProps {
  qrResult: QRCodeResult;
  onReset: () => void;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({ qrResult, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = qrResult.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPng = () => {
    downloadPng(qrResult.pngDataUrl, 'qr-code.png');
  };

  const handleDownloadSvg = () => {
    downloadSvg(qrResult.svgString, 'qr-code.svg');
  };

  return (
    <div className="preview-container" aria-live="polite">
      <div className="preview-header">
        <h2 className="preview-title">Your QR Code</h2>
        <span className="scannable-badge">
          <Sparkles size={13} /> High Resolution • High Error Correction
        </span>
      </div>

      <div className="qr-card">
        {/* The QR Code image box with clean background and quiet zone */}
        <div className="qr-image-wrapper">
          <img
            src={qrResult.pngDataUrl}
            alt={`QR Code for ${qrResult.url}`}
            className="qr-image"
            width={280}
            height={280}
            id="qr-preview-image"
          />
        </div>

        {/* Encoded URL display */}
        <div className="encoded-url-display">
          <span className="encoded-label">Target URL:</span>
          <a
            href={qrResult.url}
            target="_blank"
            rel="noopener noreferrer"
            className="encoded-url-link"
            title={qrResult.url}
          >
            <span className="url-truncate">{qrResult.url}</span>
            <ExternalLink size={13} className="external-link-icon" />
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <div className="action-button-row primary-downloads">
          <button
            type="button"
            id="download-png-btn"
            className="btn-action btn-download"
            onClick={handleDownloadPng}
            title="Download high-resolution 1024x1024 PNG"
          >
            <Download size={17} />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            id="download-svg-btn"
            className="btn-action btn-download"
            onClick={handleDownloadSvg}
            title="Download scalable vector SVG"
          >
            <Download size={17} />
            <span>Download SVG</span>
          </button>
        </div>

        <div className="action-button-row secondary-actions">
          <button
            type="button"
            id="copy-link-btn"
            className={`btn-action btn-secondary ${copied ? 'btn-copied' : ''}`}
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check size={16} className="copy-check-icon" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="reset-btn"
            className="btn-action btn-secondary btn-reset"
            onClick={onReset}
          >
            <RotateCcw size={16} />
            <span>Generate Another</span>
          </button>
        </div>
      </div>
    </div>
  );
};
