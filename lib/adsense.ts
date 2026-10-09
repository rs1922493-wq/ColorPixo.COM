/**
 * AdSense Configuration & Validation Utilities for ColorPixo.Com
 *
 * Google AdSense is 100% optional. The website functions completely and flawlessly
 * without any AdSense environment variables or Publisher credentials.
 *
 * Ads and scripts are only loaded when a verified, valid Google AdSense Publisher ID
 * (ca-pub-XXXXXXXXXXXXXXXX) and valid numeric slot ID are explicitly configured.
 */

/**
 * Validates whether a given AdSense Publisher Client ID conforms to the official Google format.
 * Format: "ca-pub-" followed by 10 to 20 digits.
 * Excludes placeholders, dummy strings, and test patterns.
 */
export function isValidAdSenseClient(client?: string | null): boolean {
  if (!client || typeof client !== 'string') {
    return false;
  }

  const trimmed = client.trim();

  // Official format is ca-pub- followed by 10 to 20 digits (standard is 16 digits)
  if (!/^(?:ca-)?pub-\d{10,20}$/.test(trimmed)) {
    return false;
  }

  // Reject dummy, placeholder, or example values
  const lower = trimmed.toLowerCase();
  const prohibited = [
    '123456789',
    'dummy',
    'fake',
    'test',
    'example',
    'placeholder',
    'xxxxxxxx',
  ];

  if (prohibited.some((word) => lower.includes(word))) {
    return false;
  }

  return true;
}

/**
 * Validates whether an AdSense Ad Slot ID is valid.
 * Slot IDs in Google AdSense are numeric strings (typically 6 to 14 digits).
 */
export function isValidAdSenseSlot(slot?: string | null): boolean {
  if (!slot || typeof slot !== 'string') {
    return false;
  }

  const trimmed = slot.trim();

  // Must consist of 6 to 16 digits
  if (!/^\d{6,16}$/.test(trimmed)) {
    return false;
  }

  const lower = trimmed.toLowerCase();
  const prohibited = ['123456789', 'dummy', 'fake', 'test', 'example', 'placeholder'];

  if (prohibited.some((word) => lower.includes(word))) {
    return false;
  }

  return true;
}
