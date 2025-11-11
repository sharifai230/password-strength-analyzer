
/**
 * Hashes a string using the SHA-1 algorithm.
 * This is used for the k-anonymity check with the HIBP API.
 * @param text The string to hash.
 * @returns A promise that resolves to the hex-encoded SHA-1 hash.
 */
export async function sha1(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
