export default function handler(): Response {
  return Response.redirect(new URL('/terms', 'https://www.echopulse.cz'), 301);
}
