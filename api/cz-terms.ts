export default function handler(): Response {
  return Response.redirect(new URL('/terms', 'https://www.behavera.com'), 301);
}
