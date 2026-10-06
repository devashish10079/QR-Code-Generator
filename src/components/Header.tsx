import React from 'react';
import { QrCode, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand">
          <div className="logo-badge">
            <QrCode className="logo-icon" size={24} />
          </div>
          <span className="brand-badge">
            <ShieldCheck size={14} /> Client-Side Only
          </span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="header-content">
        <h1 className="main-title">QR Code Generator</h1>
        <p className="main-subtitle">Generate a QR code for any link instantly.</p>
      </div>
    </header>
  );
};
