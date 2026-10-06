import React, { useRef, useEffect } from 'react';
import { ArrowRight, AlertCircle, Link as LinkIcon, Loader2 } from 'lucide-react';

interface URLInputFormProps {
  urlInput: string;
  onInputChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage: string | null;
  isLoading: boolean;
  autoFocus?: boolean;
}

export const URLInputForm: React.FC<URLInputFormProps> = ({
  urlInput,
  onInputChange,
  onSubmit,
  errorMessage,
  isLoading,
  autoFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form className="url-form" onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="url-input" className="form-label">
          Enter your URL
        </label>
        <div className={`input-wrapper ${errorMessage ? 'has-error' : ''}`}>
          <div className="input-icon-left" aria-hidden="true">
            <LinkIcon size={18} />
          </div>
          <input
            ref={inputRef}
            id="url-input"
            type="url"
            value={urlInput}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="https://example.com"
            className="url-text-input"
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? 'url-error' : undefined}
            disabled={isLoading}
            autoComplete="url"
            spellCheck={false}
          />
        </div>

        {errorMessage && (
          <div id="url-error" className="error-message" role="alert">
            <AlertCircle size={16} className="error-icon" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        id="generate-btn"
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="btn-spinner" size={18} />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>Generate QR Code</span>
            <ArrowRight size={18} className="btn-icon-right" />
          </>
        )}
      </button>
    </form>
  );
};
