const x = `template ${literal}`;
export default function handler() {
  return new Response(JSON.stringify({ success: true }));
}
