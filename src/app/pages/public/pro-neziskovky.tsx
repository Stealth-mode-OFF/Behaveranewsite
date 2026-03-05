import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useModal } from "@/app/contexts/modal-context";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { Button } from "@/app/components/ui/button";
import {
  Heart,
  Users,
  ArrowRight,
  Check,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Zap,
  Phone,
  Mail,
  Loader2,
  Send,
} from "lucide-react";
import { useSEO } from "@/app/hooks/use-seo";
import veronikaImg from "@/assets/team/veronika.webp";

/* ── Form endpoint ──────────────────────────────── */
const ENDPOINT = "/api/nonprofit-lead";

/* ── Phone formatter (+420 prefix) ──────────────── */
function formatPhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("420")) return `+${digits}`;
  if (digits.startsWith("00420")) return `+${digits.slice(2)}`;
  return `+420${digits}`;
}

/* ───────────────────────────────────────────────────
 *  /pro-neziskovky — Landing page for nonprofits
 *  Contact: Veronika Nováková
 * ─────────────────────────────────────────────────── */

const benefits = [
  {
    icon: Heart,
    title: "Speciální podmínky pro neziskovky",
    desc: "Rozumíme specifickým výzvám neziskového sektoru. Nabízíme zvýhodněné ceny a flexibilní podmínky.",
  },
  {
    icon: Users,
    title: "Engagement i pro dobrovolníky",
    desc: "Měřte nejen spokojenost zaměstnanců, ale i angažovanost dobrovolníků a externích spolupracovníků.",
  },
  {
    icon: ShieldCheck,
    title: "Anonymita a důvěra",
    desc: "Plná GDPR compliance. Vaši lidé mohou sdílet upřímnou zpětnou vazbu v bezpečném prostředí.",
  },
  {
    icon: TrendingUp,
    title: "Data pro grantové žádosti",
    desc: "Využijte engagement data jako podklad pro reporting donorům a grantovým agenturám.",
  },
  {
    icon: BarChart3,
    title: "Prevence vyhoření",
    desc: "V neziskovém sektoru je vyhoření častější. Odhalte rizika včas a podpořte své lidi.",
  },
  {
    icon: Zap,
    title: "Rychlý start",
    desc: "Nasazení do 48 hodin. Žádná složitá implementace — stačí e-maily vašich lidí.",
  },
];

const stats = [
  { value: "50 %", label: "sleva pro neziskové organizace" },
  { value: "80 %+", label: "typická response rate" },
  { value: "2 min", label: "doba vyplnění pulse checku" },
];

export function ProNeziskovkyPage() {
  const { openBooking } = useModal();

  /* ── Form state ──────────────────────────────── */
  const [form, setForm] = useState({ name: "", email: "", phone: "", organization: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: formatPhone(form.phone),
          organization: form.organization.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Chyba při odesílání");
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Nepodařilo se odeslat formulář");
      setStatus("error");
    }
  };

  useSEO({
    title: "Behavera pro neziskovky — Engagement platforma pro neziskový sektor",
    description:
      "Speciální podmínky pro neziskové organizace. Měřte engagement, předcházejte vyhoření a budujte silnější týmy. Kontaktujte Veroniku Novákovou.",
  });

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="section-spacing bg-gradient-to-b from-[#FAFAFA] via-white to-white">
          <div className="container-default max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Pro neziskové organizace
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
                Vaši lidé si zaslouží
                <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
                  {" "}být slyšet
                </span>
              </h1>
              <p className="text-lg md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto">
                Pomáháme neziskovým organizacím porozumět svým týmům, předcházet vyhoření
                a budovat prostředí, kde lidé zůstávají a podávají svůj nejlepší výkon.
              </p>
              <div className="inline-flex items-center mt-6 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
                Časově omezená nabídka: první 3 měsíce zdarma!
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats row */}
        <section className="py-12 md:py-16 bg-brand-background-secondary border-y border-brand-border">
          <div className="container-default max-w-[900px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold tracking-tight text-brand-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-brand-text-muted">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section-spacing bg-white">
          <div className="container-default max-w-[900px] mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Proč neziskovky volí Behavera
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => {
                const BIcon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="flex gap-4 p-6 rounded-2xl bg-brand-background-secondary border border-brand-border"
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-rose-50">
                      <BIcon className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-text-primary mb-1">{benefit.title}</h3>
                      <p className="text-sm text-brand-text-body leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section-spacing bg-brand-background-secondary border-y border-brand-border">
          <div className="container-default max-w-[700px] mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Jak to funguje
            </motion.h2>
            <div className="space-y-6">
              {[
                { step: "1", title: "Ozvěte se Veronice", desc: "Popište svou organizaci a kolik lidí chcete zapojit." },
                { step: "2", title: "Nastavíme vám Behavera", desc: "Do 48 hodin budete připraveni na první pulse check." },
                { step: "3", title: "Sbírejte zpětnou vazbu", desc: "Vaši lidé vyplní 2minutový pulse — anonymně a bezpečně." },
                { step: "4", title: "Jednejte na základě dat", desc: "Získáte přehledný dashboard s doporučeními pro zlepšení." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-brand-text-body">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact — Form + Veronika Nováková */}
        <section id="formular" className="section-spacing bg-white">
          <div className="container-default max-w-[900px] mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Začněte ještě dnes
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              {/* ── Lead form ─────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {status === "success" ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
                    <Check className="w-10 h-10 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Děkujeme za zájem!
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                      Veronika se vám ozve do 24 hodin.
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={veronikaImg}
                        alt="Veronika Nováková"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                      />
                      <p className="font-semibold text-green-900">Veronika Nováková</p>
                      <a
                        href="tel:+420775922506"
                        className="text-sm text-green-700 hover:underline"
                      >
                        +420 775 922 506
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="np-name" className="block text-sm font-medium text-brand-text-primary mb-1">
                        Jméno a příjmení *
                      </label>
                      <input
                        id="np-name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Jan Novák"
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="np-email" className="block text-sm font-medium text-brand-text-primary mb-1">
                        E-mail *
                      </label>
                      <input
                        id="np-email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jan@organizace.cz"
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="np-phone" className="block text-sm font-medium text-brand-text-primary mb-1">
                        Telefon
                      </label>
                      <input
                        id="np-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="777 123 456"
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="np-org" className="block text-sm font-medium text-brand-text-primary mb-1">
                        Název organizace
                      </label>
                      <input
                        id="np-org"
                        name="organization"
                        type="text"
                        value={form.organization}
                        onChange={handleChange}
                        placeholder="Nadace pro vzdělání"
                        className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        {errorMsg}
                      </p>
                    )}

                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full rounded-xl h-12 text-sm font-bold bg-brand-primary text-white hover:bg-brand-primary/90 transition-all inline-flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Odesílám…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Odeslat nezávaznou poptávku
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-brand-text-muted text-center">
                      Vaše údaje zpracováváme v souladu s GDPR. Žádný spam.
                    </p>
                  </form>
                )}
              </motion.div>

              {/* ── Veronika contact card ─────── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-brand-background-secondary border border-brand-border"
              >
                <img
                  src={veronikaImg}
                  alt="Veronika Nováková"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-brand-text-primary">
                    Veronika Nováková
                  </h3>
                  <p className="text-sm text-brand-text-muted mb-4">Customer Success</p>
                  <p className="text-sm text-brand-text-body mb-6 max-w-xs mx-auto">
                    Mám na starosti neziskové organizace. Ráda vám pomůžu najít
                    správné řešení pro váš tým.
                  </p>
                  <div className="flex flex-col gap-3 text-sm">
                    <a
                      href="tel:+420775922506"
                      className="inline-flex items-center justify-center gap-2 text-brand-text-body hover:text-brand-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      +420 775 922 506
                    </a>
                    <a
                      href="mailto:veronika@behavera.com"
                      className="inline-flex items-center justify-center gap-2 text-brand-text-body hover:text-brand-primary transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      veronika@behavera.com
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section-spacing bg-gradient-to-b from-brand-primary via-[#1a0a3e] to-[#0d0520] text-white text-center">
          <div className="container-default max-w-[700px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-8 h-8 text-rose-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Připraveni posílit svůj tým?
              </h2>
              <p className="text-white/70 mb-6 max-w-lg mx-auto">
                Domluvte si nezávaznou konzultaci s Veronikou a zjistěte, jak Behavera může pomoct vaší organizaci.
              </p>
              <Button
                onClick={() => openBooking("pro_neziskovky_cta")}
                className="rounded-2xl h-14 px-10 text-base font-bold bg-white text-brand-primary hover:bg-white/90 transition-all inline-flex items-center gap-2"
              >
                Domluvit konzultaci
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-sm text-white/50 mt-3">30 min · Zdarma · Bez závazků</p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
