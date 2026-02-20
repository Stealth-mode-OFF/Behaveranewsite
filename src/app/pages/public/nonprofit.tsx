import { useState, useRef, useCallback, type FormEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Heart, Send, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import janaImg from "@/assets/team/jana.webp";

/* ───────────────────────────────────────────────────
 *  /pro-neziskovky — Givt × Behavera landing page
 *  Single-screen, full-viewport nonprofit support page
 *  NOT linked from main nav — direct URL access only
 * ─────────────────────────────────────────────────── */

const ENDPOINT = "/api/nonprofit-lead";

// Unsplash — hands joined together, community/helping theme (free license)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80";

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

/* ── Phone formatting helpers ── */
const PHONE_PREFIX = "+420 ";

function formatPhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ");
}

function rawPhoneDigits(display: string): string {
  return display.replace(/\D/g, "");
}

export function NonprofitPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", organization: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const orgRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const withoutPrefix = input.startsWith(PHONE_PREFIX) ? input.slice(PHONE_PREFIX.length) : input;
    const digits = rawPhoneDigits(withoutPrefix).slice(0, 9);
    setForm((prev) => ({ ...prev, phone: digits }));
    setError("");
  }, []);

  const handlePhoneFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (!form.phone) setForm((prev) => ({ ...prev, phone: "" }));
    setTimeout(() => {
      const len = e.target.value.length;
      e.target.setSelectionRange(len, len);
    }, 0);
  }, [form.phone]);

  const handlePhoneKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const cursorPos = (e.target as HTMLInputElement).selectionStart ?? 0;
    if ((e.key === "Backspace" || e.key === "Delete") && cursorPos <= PHONE_PREFIX.length && !form.phone) {
      e.preventDefault();
    }
  }, [form.phone]);

  const onKeyDown = (nextRef: React.RefObject<HTMLInputElement | null>) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); nextRef.current?.focus(); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) { setError("Vyplňte prosím jméno a e-mail."); return; }
    setSending(true);
    setError("");
    try {
      const payload = { ...form, phone: form.phone ? `+420${form.phone}` : "" };
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Odesílání selhalo");
      setSent(true);
    } catch {
      setError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all text-[15px]";
  const labelClass =
    "block text-[11px] font-semibold text-white/70 mb-1 uppercase tracking-wider";

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* ── Full-screen B&W hero background ── */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.3]"
        loading="eager"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      {/* ── Content layer ── */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 sm:px-10 py-5 shrink-0">
          <a href="/" className="inline-flex items-center gap-2 group">
            <img
              src="/logo.svg"
              alt="Behavera"
              className="h-6 brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="font-display font-bold text-white/90 tracking-tight">
              Behavera
            </span>
          </a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 font-mono text-[10px] font-bold uppercase tracking-[0.12em] border border-white/10">
            <Heart className="w-3 h-3 text-rose-400" />
            Givt × Behavera
          </span>
        </header>

        {/* ── Main split: left text + right form ── */}
        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-stretch px-6 sm:px-10 lg:px-16 gap-8 lg:gap-12 pb-6 min-h-0">
          {/* Left: Message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center lg:flex-1 max-w-xl text-center lg:text-left shrink-0 lg:shrink"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white mb-4 lg:mb-6">
              Behavera{" "}
              <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">
                pomáhá
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-3">
              Lidé, kteří pomáhají druhým, si zaslouží,
              <br className="hidden sm:block" />
              aby o ně bylo taky postaráno.
            </p>

            <p className="text-base text-white/60 mb-6 lg:mb-8">
              Echo Pulse na <span className="text-white font-semibold">3 měsíce zdarma</span> pro Vaši neziskovku.
              <br className="hidden sm:block" />
              Anonymní check-in, 2 minuty týdně, bez instalace.
            </p>

            {/* Benefits — horizontal pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6 lg:mb-0">
              {["Přehled o týmu", "Prevence vyhoření", "GDPR & anonymní", "Výsledky za týden"].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-white/70 text-xs font-medium backdrop-blur-sm">
                  {t}
                </span>
              ))}
            </div>

            {/* Jana contact — desktop only */}
            <div className="hidden lg:flex items-center gap-3 mt-auto pt-6 border-t border-white/10">
              <img src={janaImg} alt="Jana Šrámková" className="w-11 h-11 rounded-full object-cover grayscale brightness-75" />
              <div>
                <p className="text-sm font-semibold text-white/90">Jana Šrámková</p>
                <p className="text-xs text-white/50 mb-0.5">Go-to-Market & Partnerships</p>
                <a href="tel:+420727850587" className="inline-flex items-center gap-1 text-xs text-rose-300/80 hover:text-rose-300 transition-colors">
                  <Phone className="w-3 h-3" />
                  +420 727 850 587
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Form card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full max-w-md lg:max-w-sm flex flex-col justify-center shrink-0"
          >
            <div className="bg-white/[0.07] backdrop-blur-md rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl">
              {sent ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-white mb-2">Děkujeme!</h2>
                  <p className="text-sm text-white/70 leading-relaxed mb-5">
                    Brzy se Vám ozveme a vše připravíme.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                    <img src={janaImg} alt="Jana Šrámková" className="w-9 h-9 rounded-full object-cover grayscale brightness-75" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white/90">Jana Šrámková</p>
                      <a href="tel:+420727850587" className="text-xs text-rose-300/80 hover:text-rose-300 transition-colors">
                        +420 727 850 587
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-5">
                    <h2 className="text-lg font-bold text-white mb-1">Zapojte se</h2>
                    <p className="text-xs text-white/50">Vyplňte kontakt — ozveme se do 24 hodin.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="np-name" className={labelClass}>Jméno *</label>
                      <input id="np-name" type="text" required autoFocus autoComplete="name" value={form.name} onChange={handleChange("name")} onKeyDown={onKeyDown(emailRef)} placeholder="Jan Novák" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="np-email" className={labelClass}>E-mail *</label>
                      <input id="np-email" ref={emailRef} type="email" required autoComplete="email" value={form.email} onChange={handleChange("email")} onKeyDown={onKeyDown(phoneRef)} placeholder="jan@organizace.cz" className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="np-phone" className={labelClass}>Telefon</label>
                      <input
                        id="np-phone" ref={phoneRef} type="tel" autoComplete="tel"
                        value={form.phone ? `${PHONE_PREFIX}${formatPhoneDigits(form.phone)}` : ""}
                        onChange={handlePhoneChange} onFocus={handlePhoneFocus}
                        onKeyDown={(e) => { handlePhoneKeyDown(e); if (e.key === "Enter") { e.preventDefault(); orgRef.current?.focus(); } }}
                        placeholder="+420" className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="np-org" className={labelClass}>Organizace</label>
                      <input id="np-org" ref={orgRef} type="text" autoComplete="organization" value={form.organization} onChange={handleChange("organization")} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).form?.requestSubmit(); } }} placeholder="Dobrá věc, z. s." className={inputClass} />
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full h-12 rounded-xl text-sm font-bold bg-white text-gray-900 hover:bg-white/90 transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
                    >
                      {sending ? "Odesílám…" : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Chci se zapojit
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-[10px] text-white/30 text-center mt-3">
                    Bez závazků · Odpovíme do 24 h
                  </p>
                </>
              )}
            </div>

            {/* Jana contact — mobile only */}
            <div className="flex lg:hidden items-center gap-3 mt-4 px-1">
              <img src={janaImg} alt="Jana Šrámková" className="w-10 h-10 rounded-full object-cover grayscale brightness-75" />
              <div>
                <p className="text-sm font-semibold text-white/90">Jana Šrámková</p>
                <a href="tel:+420727850587" className="inline-flex items-center gap-1 text-xs text-rose-300/80 hover:text-rose-300 transition-colors">
                  <Phone className="w-3 h-3" />
                  +420 727 850 587
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <footer className="shrink-0 flex items-center justify-between px-6 sm:px-10 py-4 text-[11px] text-white/25">
          <span>© {new Date().getFullYear()} Behavera s.r.o.</span>
          <a href="/" className="text-white/35 hover:text-white/60 transition-colors font-medium">
            behavera.com
          </a>
        </footer>
      </div>
    </div>
  );
}
