export function getCsrfToken(): string {
  const csrfToken = document.querySelector('meta[name="authenticity-token"]')?.getAttribute("content");

  if (csrfToken) return csrfToken;
  throw new Error("CSRF Token não foi encontrado.");
}
