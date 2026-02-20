import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Smile, ShieldCheck, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

/* ───────────────────────────────────────────────────
 *  /pro-neziskovky — Givt × Behavera landing page
 *  Newsletter campaign for Czech nonprofits
 *  NOT linked from main nav — direct URL access only
 * ─────────────────────────────────────────────────── */

const ENDPOINT = "/api/nonprofit-lead";

interface FormState {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

export function NonprofitPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", organization: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
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
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Odesílání selhalo");
      setSent(true);
    } catch {
      setError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F6FF] via-white to-[#F0EBFF]">
      {/* Minimal top bar */}
      <header className="py-5 px-6">
        <a href="/" className="inline-flex items-center gap-2 group">
          <img
            src="/logo.svg"
            alt="Behavera"
            className="h-7 opacity-90 group-hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-display font-bold text-lg text-brand-primary tracking-tight">
            Behavera
          </span>
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-20">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-8 pb-12"
        >
          {/* Partner badges */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary font-mono text-[11px] font-bold uppercase tracking-[0.12em] border border-brand-primary/10">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Givt × Behavera
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.08] text-brand-text-primary mb-5">
            Behavera{" "}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              pomáhá
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-text-body leading-relaxed max-w-lg mx-auto mb-3">
            Lidé jsou důležití. Ti, co pomáhají druhým,
            si zaslouží, aby o ně bylo taky postaráno.
          </p>

          <p className="text-base text-brand-text-secondary font-medium">
            Echo Pulse na{" "}
            <span className="text-brand-primary font-bold">3 měsíce zdarma</span>{" "}
            pro Vaši neziskovou organizaci.
          </p>
        </motion.section>

        {/* Benefits */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
        >
          {[
            { icon: Users, title: "Potřeby týmu", desc: "Zjistěte, co Vaši lidé skutečně potřebují." },
            { icon: Smile, title: "Radosti i starosti", desc: "Kompletní přehled nálady a motivace." },
            { icon: ShieldCheck, title: "Důvěrné & anonymní", desc: "GDPR compliant, plně anonymní odpovědi." },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-brand-border shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-brand-primary" />
              </div>
              <h3 className="font-bold text-brand-text-primary text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-brand-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.section>

        {/* Form card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          id="formular"
        >
          <div className="bg-white rounded-3xl border border-brand-border shadow-lg p-7 sm:p-10">
            {sent ? (
              /* ── Success state ── */
              <div className="text-center py-8">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
                  Děkujeme!
                </h2>
                <p className="text-brand-text-body leading-relaxed max-w-sm mx-auto">
                  Brzy se Vám ozveme a vše pro Vás připravíme.
                  Těšíme se na spolupráci!
                </p>
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
                  <div>
                    <label htmlFor="np-name" className="block text-xs font-semibold text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                      Jméno a příjmení *
                    </label>
                    <input
                      id="np-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Jan Novák"
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background-secondary text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="np-email" className="block text-xs font-semibold text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                      E-mail *
                    </label>
                    <input
                      id="np-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="jan@organizace.cz"
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background-secondary text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="np-phone" className="block text-xs font-semibold text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                      Telefon
                    </label>
                    <input
                      id="np-phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="+420 123 456 789"
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background-secondary text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="np-org" className="block text-xs font-semibold text-brand-text-secondary mb-1.5 uppercase tracking-wider">
                      Název organizace
                    </label>
                    <input
                      id="np-org"
                      type="text"
                      value={form.organization}
                      onChange={handleChange("organization")}
                      placeholder="Dobrá věc, z. s."
                      className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-background-secondary text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all text-sm"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-13 rounded-2xl text-base font-bold bg-brand-primary text-white hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  >
                    {sending ? (
                      "Odesílám…"
                    ) : (
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

        {/* Bottom micro‑copy */}
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

      {/* Minimal footer */}
      <footer className="py-6 text-center border-t border-brand-border/50">
        <p className="text-xs text-brand-text-muted">
          © {new Date().getFullYear()} Behavera s.r.o. · Všechna práva vyhrazena
        </p>
      </footer>
    </div>
  );
}
