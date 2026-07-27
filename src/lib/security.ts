/**
 * Base256 Security Utility for Order Token Obfuscation
 *
 * Prevents Sequential Order ID Enumeration (IDOR attacks) in URL parameters
 * by encoding order IDs into URL-safe Base256 byte representations.
 */

/**
 * Encodes an Order ID (e.g. "ORD-2024-001") into a Base256 URL-safe token.
 */
export function encodeOrderIdBase256(orderId: string): string {
  if (!orderId) return "";
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(orderId);
    // Convert Uint8Array bytes (0-255) to hex representation
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `ord_b256_${hex}`;
  } catch (err) {
    console.error("Failed to encode Order ID to Base256:", err);
    return orderId;
  }
}

/**
 * Decodes a Base256 URL token back to the original Order ID string.
 */
export function decodeOrderIdBase256(token: string): string {
  if (!token) return "";
  try {
    if (!token.startsWith("ord_b256_")) {
      // Fallback for legacy raw order IDs or unencoded fallback
      return token;
    }
    const hex = token.replace("ord_b256_", "");
    const bytes = new Uint8Array(
      hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (err) {
    console.error("Failed to decode Base256 Order Token:", err);
    return token;
  }
}
