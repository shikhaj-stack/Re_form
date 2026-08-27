export function sanitizeString(input: string): string {
  if (!input) return "";
  return input
    .trim()
    .replace(/[<>]/g, "") // Strip dangerous HTML tags
    .slice(0, 1000); // Guard against abnormally huge string payloads
}

export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
