export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: string;
}

export function validateUrl(rawInput: string): ValidationResult {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      isValid: false,
      error: 'Please enter a URL.',
    };
  }

  // Check basic URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL (e.g., https://example.com).',
    };
  }

  // Must use http or https protocol
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'URL must begin with http:// or https://',
    };
  }

  // Hostname must be present and valid
  const hostname = parsedUrl.hostname;
  if (!hostname || hostname.length < 1) {
    return {
      isValid: false,
      error: 'Please enter a valid URL with a valid domain name.',
    };
  }

  // Hostname must either be localhost or contain at least one dot (domain.tld or IP)
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const hasDot = hostname.includes('.');
  if (!isLocalhost && !hasDot) {
    return {
      isValid: false,
      error: 'Please enter a complete domain (e.g., https://example.com).',
    };
  }

  return {
    isValid: true,
    sanitizedUrl: trimmed,
  };
}
