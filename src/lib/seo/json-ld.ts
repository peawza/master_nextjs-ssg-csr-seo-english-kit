/** JSON-LD safe for a <script> element. Only use verified, visible claims. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
