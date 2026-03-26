/**
 * Validate and sanitize URLs to prevent SSRF attacks.
 * Only allows http/https to public domains.
 */

const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',
];

const BLOCKED_IP_RANGES = [
  /^10\./,                          // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[01])\./,  // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16
  /^169\.254\./,                     // Link-local (AWS/GCP metadata)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-2][0-7])\./,  // Carrier-grade NAT
  /^0\./,                            // 0.0.0.0/8
  /^fc[0-9a-f]{2}:/i,               // IPv6 ULA
  /^fe80:/i,                         // IPv6 link-local
];

export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' };
  }

  // Ensure protocol
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Only allow http/https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP/HTTPS URLs are allowed' };
  }

  // Block known internal hosts
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.includes(hostname)) {
    return { valid: false, error: 'Internal hosts are not allowed' };
  }

  // Block IP-based URLs that resolve to private ranges
  if (BLOCKED_IP_RANGES.some((re) => re.test(hostname))) {
    return { valid: false, error: 'Private IP ranges are not allowed' };
  }

  // Block URLs with auth info (user:pass@host)
  if (parsed.username || parsed.password) {
    return { valid: false, error: 'URLs with credentials are not allowed' };
  }

  // Block non-standard ports commonly used for internal services
  if (parsed.port && !['80', '443', ''].includes(parsed.port)) {
    return { valid: false, error: 'Non-standard ports are not allowed' };
  }

  return { valid: true, url: normalized };
}
