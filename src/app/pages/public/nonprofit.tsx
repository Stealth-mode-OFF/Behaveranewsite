import { useState, useRef, useCallback, type FormEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Heart, Send, CheckCircle2, Phone, Shield, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import veronikaImg from "@/assets/team/veronika.webp";

/* ───────────────────────────────────────────────────
 *  /pro-neziskovky — Givt × Behavera landing page
 *  On-brand light design matching cz.behavera.com
 *  NOT linked from main nav — direct URL access only
 * ─────────────────────────────────────────────────── */

const ENDPOINT = "/api/nonprofit-lead";

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

const BENEFITS = [
  { icon: Users, title: "Přehled o týmu", desc: "Víte, jak se Vaši lidé skutečně mají — ne jen co říkají na poradách." },
  { icon: Shield, title: "Prevence vyhoření", desc: "Zachytíte první signály únavy dřív, než se z nich stane odchod." },
  { icon: Clock, title: "2 minuty týdně", desc: "Anonymní check-in bez instalace. Výsledky hned v dashboardu." },
  { icon: Sparkles, title: "3 měsíce zdarma", desc: "Echo Pulse pro Vaši neziskovku — plně zdarma, bez závazků." },
];

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
    "w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent/50 transition-all text-[15px]";
  const labelClass =
    "block text-[11px] font-semibold text-brand-text-muted mb-1 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-background-secondary via-white to-brand-background-secondary">

      {/* ── Soft background glow ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-brand-primary/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-brand-accent/[0.06] rounded-full blur-[120px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-brand-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="/" className="inline-flex items-center gap-2 group">
            <img
              src="/logo.svg"
              alt="Behavera"
              className="h-6 opacity-90 group-hover:opacity-100 transition-opacity"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="font-display font-bold text-brand-text-primary tracking-tight">
              Behavera
            </span>
          </a>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-brand-border shadow-sm text-brand-text-muted font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
            <Heart className="w-3 h-3 text-brand-accent" />
            Givt × Behavera
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-border shadow-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-brand-text-muted">
              Pro neziskové organizace
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-brand-text-primary leading-[1.05] mb-6"
          >
            Lidé, kteří pomáhají druhým,
            <br className="hidden sm:block" />
            si zaslouží{" "}
            <span className="text-gradient">
              aby o ně bylo postaráno.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto mb-4"
          >
            Behavera Echo Pulse na <strong className="text-brand-text-primary">3 měsíce zdarma</strong> pro Vaši neziskovku.
            Anonymní check-in, 2 minuty týdně, bez instalace.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-sm text-brand-text-muted"
          >
            Bez kreditní karty · Bez závazku · Výsledky ihned
          </motion.p>
        </div>
      </section>

      {/* ── Benefits grid ── */}
      <section className="pb-12 sm:pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              className="flex gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-brand-border/50 shadow-sm hover:shadow-md hover:border-brand-accent/20 transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-background-muted flex items-center justify-center">
                <b.icon className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-brand-text-primary text-sm mb-1">{b.title}</h3>
                <p className="text-sm text-brand-text-body leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Form section ── */}
      <section className="pb-16 sm:pb-24 px-6">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl border border-brand-border shadow-lg p-6 sm:p-8"
          >
            {sent ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-brand-text-primary mb-2">Děkujeme!</h2>
                <p className="text-sm text-brand-text-body leading-relaxed mb-6">
                  Brzy se Vám ozveme a vše připravíme.
                </p>
                <div className="flex items-center justify-center gap-3 pt-5 border-t border-brand-border">
                  <img src={veronikaImg} alt="Veronika Nováková" className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brand-text-primary">Veronika Nováková</p>
                    <a href="tel:+420775922506" className="inline-flex items-center gap-1 text-xs text-brand-accent hover:text-brand-primary transition-colors">
                      <Phone className="w-3 h-3" />
                      +420 775 922 506
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-lg font-display font-bold text-brand-text-primary mb-1">Zapojte se</h2>
                  <p className="text-sm text-brand-text-muted">Vyplňte kontakt — ozveme se do 24 hodin.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                  <Button
                    type="submit"
                    disabled={sending}
                    size="lg"
                    className="w-full h-12 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
                  >
                    {sending ? "Odesílám…" : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Chci se zapojit
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-[11px] text-brand-text-muted/60 text-center mt-4">
                  Bez závazků · Odpovíme do 24 h
                </p>
              </>
            )}
          </motion.div>

          {/* Veronika contact — below form */}
          {!sent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mt-6"
            >
              <img src={veronikaImg} alt="Veronika Nováková" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-brand-text-primary">Veronika Nováková</p>
                <p className="text-xs text-brand-text-muted mb-0.5">Customer Success</p>
                <a href="tel:+420775922506" className="inline-flex items-center gap-1 text-xs text-brand-accent hover:text-brand-primary transition-colors">
                  <Phone className="w-3 h-3" />
                  +420 775 922 506
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-brand-border/50 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] text-brand-text-muted/60">
          <span>© {new Date().getFullYear()} Behavera s.r.o.</span>
          <a href="/" className="text-brand-text-muted/80 hover:text-brand-primary transition-colors font-medium">
            behavera.com
          </a>
        </div>
      </footer>
    </div>
  );
}
