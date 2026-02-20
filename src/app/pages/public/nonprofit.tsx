import { useState, useRef, useCallback, type FormEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Heart, Users, Smile, ShieldCheck, Send, CheckCircle2, ArrowRight,
  Clock, BarChart3, MessageCircleHeart, Phone,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import janaImg from "@/assets/team/jana.webp";

/* ───────────────────────────────────────────────────
 *  /pro-neziskovky — Givt × Behavera landing page
 *  Newsletter campaign for Czech nonprofits
 *  NOT linked from main nav — direct URL access only
 * ─────────────────────────────────────────────────── */

const ENDPOINT = "/api/nonprofit-lead";

// Unsplash — hands joined together, community/helping theme (free license)
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80";

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

/* ── Phone formatting helpers ── */
const PHONE_PREFIX = "+420 ";

function formatPhoneDigits(raw: string): string {
  // keep only digits after +420
  const digits = raw.replace(/\D/g, "").slice(0, 9);
  // group by 3
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

  // refs for auto-focus jump
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const orgRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  /* Phone field: auto-prefix +420, group digits by 3 */
  const phoneDisplay = form.phone ? `${PHONE_PREFIX}${formatPhoneDigits(form.phone)}` : "";

  const handlePhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // strip prefix and non-digits
    const withoutPrefix = input.startsWith(PHONE_PREFIX) ? input.slice(PHONE_PREFIX.length) : input;
    const digits = rawPhoneDigits(withoutPrefix).slice(0, 9);
    setForm((prev) => ({ ...prev, phone: digits }));
    setError("");
  }, []);

  const handlePhoneFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (!form.phone) {
      // show prefix immediately on focus
      setForm((prev) => ({ ...prev, phone: "" }));
    }
    // move cursor to end
    setTimeout(() => {
      const len = e.target.value.length;
      e.target.setSelectionRange(len, len);
    }, 0);
  }, [form.phone]);

  const handlePhoneKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    // prevent deleting the +420 prefix
    const cursorPos = (e.target as HTMLInputElement).selectionStart ?? 0;
    if ((e.key === "Backspace" || e.key === "Delete") && cursorPos <= PHONE_PREFIX.length && !form.phone) {
      e.preventDefault();
    }
  }, [form.phone]);

  /* Auto-advance on Enter */
  const onKeyDown = (nextRef: React.RefObject<HTMLInputElement | null>) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) {
      setError("Vyplňte prosím jméno a e-mail.");
      return;
    }
    setSending(true);
    setError("");
    try {
      // send full phone with prefix
      const payload = {
        ...form,
        phone: form.phone ? `+420${form.phone}` : "",
      };
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
    "w-full px-4 py-3.5 rounded-xl border border-brand-border bg-brand-background-secondary text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all text-[15px]";
  const labelClass =
    "block text-[11px] font-semibold text-brand-text-secondary mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal top bar */}
      <header className="py-5 px-6 relative z-10">
        <a href="/" className="inline-flex items-center gap-2 group">
          <img
            src="/logo.svg"
            alt="Behavera"
            className="h-7 opacity-90 group-hover:opacity-100 transition-opacity"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="font-display font-bold text-lg text-brand-primary tracking-tight">
            Behavera
          </span>
        </a>
      </header>

      {/* ── Hero with B&W photo background ── */}
      <section className="relative overflow-hidden">
        {/* B&W photo */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover grayscale brightness-[0.35]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/40 via-brand-primary/20 to-white" />
        </div>

        <div className="relative max-w-2xl mx-auto px-5 pt-16 pb-28 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white font-mono text-[11px] font-bold uppercase tracking-[0.12em] border border-white/20 mb-6">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Givt × Behavera
            </span>

            <h1 className="font-display text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight leading-[1.08] text-white mb-5">
              Behavera{" "}
              <span className="text-brand-accent">pomáhá</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-md mx-auto mb-3">
              Lidé jsou důležití. Ti, co pomáhají druhým,
              si zaslouží, aby o ně bylo taky postaráno.
            </p>

            <p className="text-base text-white/70 font-medium">
              Echo Pulse na{" "}
              <span className="text-white font-bold">3 měsíce zdarma</span>{" "}
              pro Vaši neziskovou organizaci.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-5 -mt-16 relative z-10 pb-20">
        {/* ── What is Echo Pulse ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl border border-brand-border shadow-lg p-7 sm:p-9 mb-6"
        >
          <h2 className="text-lg font-bold text-brand-text-primary mb-5 text-center">
            Co získáte?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Users, title: "Přehled o potřebách týmu", desc: "Zjistíte, co Vaši lidé skutečně potřebují, kde je tlačí bota a co je motivuje." },
              { icon: Smile, title: "Radosti i starosti na jednom místě", desc: "Kompletní obraz nálady, zapojení a spokojenosti — ne jen tabulka s čísly." },
              { icon: Clock, title: "2 minuty týdně, žádná instalace", desc: "Anonymní check-in jednou týdně. Bez aplikace, bez firemního e-mailu. Stačí odkaz." },
              { icon: BarChart3, title: "Výsledky už po prvním týdnu", desc: "Srozumitelný dashboard s trendy, kterým rozumí každý manažer i zakladatel." },
              { icon: ShieldCheck, title: "Důvěrné & anonymní", desc: "GDPR compliant, plně anonymní odpovědi. Lidé řeknou, co si skutečně myslí." },
              { icon: MessageCircleHeart, title: "Prevence, ne hašení požárů", desc: "Odhalte vyhoření a tichý odchod dřív, než bude pozdě. Data místo dojmů." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-2xl bg-brand-background-secondary/60 border border-brand-border/60">
                <div className="w-9 h-9 rounded-lg bg-brand-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4.5 h-4.5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-primary text-sm leading-snug mb-0.5">{item.title}</h3>
                  <p className="text-xs text-brand-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Signup form card ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          id="formular"
        >
          <div className="bg-white rounded-3xl border border-brand-border shadow-lg p-7 sm:p-10">
            {sent ? (
              /* ── Success ── */
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-brand-text-primary mb-2">Děkujeme!</h2>
                <p className="text-brand-text-body leading-relaxed max-w-sm mx-auto mb-6">
                  Brzy se Vám ozveme a vše pro Vás připravíme. Těšíme se na spolupráci!
                </p>
                {/* Jana contact in success state too */}
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-brand-border/50">
                  <img src={janaImg} alt="Jana Šrámková" className="w-10 h-10 rounded-full object-cover grayscale" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brand-text-primary">Jana Šrámková</p>
                    <a href="tel:+420727850587" className="text-xs text-brand-accent hover:text-brand-primary transition-colors">
                      +420 727 850 587
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-text-primary mb-2">
                    Zapojte se do programu
                  </h2>
                  <p className="text-sm text-brand-text-muted">
                    Vyplňte kontakt a my se Vám brzy ozveme. Vše pro Vás nastavíme.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="np-name" className={labelClass}>Jméno a příjmení *</label>
                    <input
                      id="np-name"
                      type="text"
                      required
                      autoFocus
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange("name")}
                      onKeyDown={onKeyDown(emailRef)}
                      placeholder="Jan Novák"
                      className={inputClass}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="np-email" className={labelClass}>E-mail *</label>
                    <input
                      id="np-email"
                      ref={emailRef}
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      onKeyDown={onKeyDown(phoneRef)}
                      placeholder="jan@organizace.cz"
                      className={inputClass}
                    />
                  </div>

                  {/* Phone with +420 auto-prefix and digit grouping */}
                  <div>
                    <label htmlFor="np-phone" className={labelClass}>Telefon</label>
                    <input
                      id="np-phone"
                      ref={phoneRef}
                      type="tel"
                      autoComplete="tel"
                      value={form.phone || phoneDisplay ? `${PHONE_PREFIX}${formatPhoneDigits(form.phone)}` : ""}
                      onChange={handlePhoneChange}
                      onFocus={handlePhoneFocus}
                      onKeyDown={(e) => {
                        handlePhoneKeyDown(e);
                        if (e.key === "Enter") { e.preventDefault(); orgRef.current?.focus(); }
                      }}
                      placeholder="+420"
                      className={inputClass}
                    />
                  </div>

                  {/* Organization */}
                  <div>
                    <label htmlFor="np-org" className={labelClass}>Název organizace</label>
                    <input
                      id="np-org"
                      ref={orgRef}
                      type="text"
                      autoComplete="organization"
                      value={form.organization}
                      onChange={handleChange("organization")}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).form?.requestSubmit(); } }}
                      placeholder="Dobrá věc, z. s."
                      className={inputClass}
                    />
                  </div>

                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-14 rounded-2xl text-base font-bold bg-brand-primary text-white hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {sending ? "Odesílám…" : (
                      <>
                        <Send className="w-4 h-4" />
                        Chci se zapojit
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.section>

        {/* ── Jana contact strip ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 rounded-2xl bg-brand-background-secondary border border-brand-border p-5 sm:p-6"
        >
          <div className="flex items-center gap-4">
            <img
              src={janaImg}
              alt="Jana Šrámková"
              className="w-16 h-16 rounded-2xl object-cover grayscale hover:grayscale-0 transition-all duration-500 shrink-0"
            />
            <div>
              <p className="text-sm font-bold text-brand-text-primary mb-0.5">
                Máte otázky? Ozvěte se Janě.
              </p>
              <p className="text-xs text-brand-text-muted mb-2">
                Jana Šrámková · Go-to-Market & Partnerships
              </p>
              <a
                href="tel:+420727850587"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-bold hover:bg-brand-primary/10 transition-colors"
              >
                <Phone className="w-3 h-3" />
                +420 727 850 587
              </a>
            </div>
          </div>
        </motion.section>

        {/* Bottom micro-copy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10 space-y-2"
        >
          <p className="text-xs text-brand-text-muted">
            Echo Pulse · 3 měsíce zdarma · Bez závazků
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-xs text-brand-accent hover:text-brand-primary transition-colors font-medium"
          >
            Více o Behavera
            <ArrowRight className="w-3 h-3" />
          </a>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-brand-border/50">
        <p className="text-xs text-brand-text-muted">
          © {new Date().getFullYear()} Behavera s.r.o. · Všechna práva vyhrazena
        </p>
      </footer>
    </div>
  );
}
