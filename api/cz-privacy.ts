export default function handler(): Response {
  return Response.redirect(new URL('/privacy-policy', 'https://www.behavera.com'), 301);
}
