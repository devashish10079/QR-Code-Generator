import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('QR Code Generator App', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('renders initial form with correct title, label, placeholder, and button', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /qr code generator/i })).toBeInTheDocument();
    expect(screen.getByText(/generate a qr code for any link instantly/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enter your url/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate qr code/i })).toBeInTheDocument();
  });

  it('displays a validation error when submitting empty input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const generateBtn = screen.getByRole('button', { name: /generate qr code/i });
    await user.click(generateBtn);

    expect(await screen.findByRole('alert')).toHaveTextContent('Please enter a URL.');
  });

  it('displays a validation error for invalid URL input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter your url/i);
    await user.type(input, 'not-a-valid-url');

    const generateBtn = screen.getByRole('button', { name: /generate qr code/i });
    await user.click(generateBtn);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please enter a valid URL (e.g., https://example.com).'
    );
  });

  it('generates QR code and displays preview card for valid URL', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter your url/i);
    await user.type(input, 'https://example.com');

    const generateBtn = screen.getByRole('button', { name: /generate qr code/i });
    await user.click(generateBtn);

    // QR Preview card elements
    expect(await screen.findByRole('heading', { level: 2, name: /your qr code/i })).toBeInTheDocument();
    
    const qrImage = screen.getByRole('img', { name: /qr code for https:\/\/example\.com/i });
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveAttribute('src', expect.stringContaining('data:image/png;base64'));

    expect(screen.getByText('https://example.com')).toBeInTheDocument();

    // Action buttons
    expect(screen.getByRole('button', { name: /download png/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download svg/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate another/i })).toBeInTheDocument();
  });

  it('handles "Copy Link" action with user feedback', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue();

    render(<App />);

    const input = screen.getByLabelText(/enter your url/i);
    await user.type(input, 'https://example.com');
    await user.click(screen.getByRole('button', { name: /generate qr code/i }));

    const copyBtn = await screen.findByRole('button', { name: /copy link/i });
    await user.click(copyBtn);

    expect(writeTextSpy).toHaveBeenCalledWith('https://example.com');
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  it('handles "Download PNG" click and triggers file download', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter your url/i);
    await user.type(input, 'https://example.com');
    await user.click(screen.getByRole('button', { name: /generate qr code/i }));

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const downloadPngBtn = await screen.findByRole('button', { name: /download png/i });
    await user.click(downloadPngBtn);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('handles "Download SVG" click and triggers file download', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter your url/i);
    await user.type(input, 'https://example.com');
    await user.click(screen.getByRole('button', { name: /generate qr code/i }));

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const downloadSvgBtn = await screen.findByRole('button', { name: /download svg/i });
    await user.click(downloadSvgBtn);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('resets the form and returns to URL input when clicking "Generate Another"', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText(/enter your url/i);
    await user.type(input, 'https://example.com');
    await user.click(screen.getByRole('button', { name: /generate qr code/i }));

    const resetBtn = await screen.findByRole('button', { name: /generate another/i });
    await user.click(resetBtn);

    // Form is back
    const freshInput = await screen.findByLabelText(/enter your url/i);
    expect(freshInput).toBeInTheDocument();
    expect(freshInput).toHaveValue('');
    expect(screen.queryByRole('heading', { level: 2, name: /your qr code/i })).not.toBeInTheDocument();
  });

  it('toggles light/dark theme when clicking theme toggle button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggleBtn = screen.getByRole('button', { name: /switch to/i });
    const initialTheme = document.documentElement.getAttribute('data-theme');

    await user.click(toggleBtn);
    const newTheme = document.documentElement.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);
  });
});
