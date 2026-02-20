import { useState, useRef, useCallback, type FormEvent, type ChangeEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Heart, Send, CheckCircle2, Phone, Shield, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import janaImg from "@/assets/team/jana.webp";

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
  // ...existing code for state, handlers, etc. (beze změny)

  // ...handlers, inputClass, labelClass (beze změny)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-background-secondary via-white to-brand-background-secondary p-0">
      {/* Kompaktní card layout */}
      <div className="w-full max-w-3xl mx-auto my-0 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 bg-white/80 rounded-2xl shadow-xl border border-brand-border/40 p-0 md:p-0 overflow-hidden" style={{ minHeight: 480 }}>
        {/* Levý blok: hero + benefity */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-7 md:py-0 md:pl-8 md:pr-4 gap-3 md:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-brand-border shadow-sm mb-2">
            <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-brand-text-muted">Pro neziskovky</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-brand-text-primary leading-tight text-center mb-1">
            Pomáhejte druhým — my pomůžeme Vám
          </h1>
          <p className="text-sm text-brand-text-body text-center mb-2">
            Echo Pulse na <b>3 měsíce zdarma</b> pro Vaši neziskovku. Anonymní check-in, 2 minuty týdně, bez instalace.
          </p>
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-2 mb-1">
            {BENEFITS.slice(0, 4).map((b, i) => (
              <div key={b.title} className="flex flex-col items-center bg-brand-background-muted rounded-xl p-3 border border-brand-border/30">
                <b.icon className="w-5 h-5 text-brand-primary mb-1" />
                <span className="font-bold text-xs text-brand-text-primary text-center leading-tight mb-0.5">{b.title}</span>
                <span className="text-[11px] text-brand-text-muted text-center leading-tight">{b.desc}</span>
              </div>
            ))}
          </div>
          <span className="text-[11px] text-brand-text-muted/80 mt-1">Bez kreditní karty · Bez závazku · Výsledky ihned</span>
        </div>
        {/* Pravý blok: formulář + kontakt */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-7 md:py-0 md:pr-8 md:pl-4 gap-3 md:gap-4 border-t md:border-t-0 md:border-l border-brand-border/20 bg-white/90">
          <div className="w-full max-w-xs mx-auto">
            <h2 className="text-lg font-display font-bold text-brand-text-primary mb-1 text-center">Chci 3 měsíce zdarma</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
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
                className="w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-60"
              >
                {sending ? "Odesílám…" : (<><Send className="w-3.5 h-3.5" />Chci se zapojit</>)}
              </Button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4">
              <img src={janaImg} alt="Jana Šrámková" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-xs font-semibold text-brand-text-primary mb-0">Jana Šrámková</p>
                <a href="tel:+420727850587" className="inline-flex items-center gap-1 text-xs text-brand-accent hover:text-brand-primary transition-colors">
                  <Phone className="w-3 h-3" />+420 727 850 587
                </a>
              </div>
            </div>
            <p className="text-[10px] text-brand-text-muted/60 text-center mt-2">Bez závazků · Odpovíme do 24 h</p>
          </div>
        </div>
      </div>
      {/* Footer minimalistický */}
      <footer className="w-full text-center text-[11px] text-brand-text-muted/60 py-2 mt-2">
        © {new Date().getFullYear()} Behavera s.r.o. &nbsp;|&nbsp; <a href="/" className="text-brand-text-muted/80 hover:text-brand-primary transition-colors font-medium">behavera.com</a>
      </footer>
    </div>
  );
}
