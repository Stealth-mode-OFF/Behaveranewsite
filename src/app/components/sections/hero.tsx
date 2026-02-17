import { Button } from "@/app/components/ui/button";
import { ArrowRight, Play, Shield, Clock, Zap, Users } from "lucide-react";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DeviceFrame, AnimatedDashboardContent } from "@/app/components/ui/device-frame";
import heroDashboardCz from "@/assets/hero-dashboard-cz.webp";
import heroDashboardEn from "@/assets/hero-dashboard-en.webp";

/**
 * Hero — Sharp, conversion-focused carousel.
 *
 * Three rotating headlines targeted at CEO & HR → subtitle → dual CTA → trust line.
 * Auto-advances every 6s with manual dot navigation.
 */

/* ─── Carousel slide type ─── */
interface HeroSlide {
  headline: React.ReactNode;
  headlineHighlight: string;
  subtitle: string;
}

export function Hero() {
  const { language } = useLanguage();
  const { openBooking } = useModal();

  const copy = {
    cz: {
      badge: "Pro CEO a HR, kteří nechtějí hádat",
      slides: [
        {
          headline: <>Vaši nejlepší lidé<br className="hidden md:block" />{' '}přemýšlejí o odchodu.{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">Vy to nevíte.</span></>,
          headlineHighlight: "",
          subtitle: "Echo Pulse sbírá zpětnou vazbu přes krátký AI chat jednou měsíčně. Výsledky vidíte okamžitě v dashboardu — podle týmů, témat i rizik. Přestaňte hádat. Začněte vědět.",
        },
        {
          headline: <>Odchody stojí firmu<br className="hidden md:block" />{' '}stovky tisíc ročně.{' '}</>,
          headlineHighlight: "Předejděte jim včas.",
          subtitle: "Echo Pulse odhalí rizikové signály dřív, než vám klíčoví lidé dají výpověď. Jeden krátký AI chat měsíčně stačí — vy vidíte, kde hoří, a můžete jednat.",
        },
        {
          headline: <>HR reporty plné čísel,<br className="hidden md:block" />{' '}ale{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">žádné odpovědi?</span></>,
          headlineHighlight: "",
          subtitle: "Echo Pulse dává HR i CEO konkrétní doporučení — ne jen grafy. Víte přesně, co trápí který tým, a máte podklady pro rozhodování.",
        },
      ] as HeroSlide[],
      primaryCta: "Otestovat 1 tým zdarma",
      ctaMicro: "Bez závazku. Výsledky jsou vidět okamžitě.",
      secondaryCta: "Rezervovat demo",
      socialProof: "50 000+ otestovaných lidí",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Výsledky okamžitě v dashboardu" },
        { icon: Zap, text: "Pro firmy 50–500 lidí" },
      ],
    },
    en: {
      badge: "For CEOs and HR who refuse to guess",
      slides: [
        {
          headline: "Your best people are",
          headlineHighlight: "thinking about leaving.",
          subtitle: "Echo Pulse collects feedback through a short AI chat once a month. Results appear instantly in your dashboard — by team, topic, and risk. Stop guessing. Start knowing.",
        },
        {
          headline: "Turnover costs your company",
          headlineHighlight: "hundreds of thousands a year.",
          subtitle: "Echo Pulse detects risk signals before your key people hand in their notice. One short AI chat per month is all it takes — you see where the fire is and act.",
        },
        {
          headline: <>HR reports full of numbers,<br className="hidden md:block" />{' '}but{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">no answers?</span></>,
          headlineHighlight: "",
          subtitle: "Echo Pulse gives HR and CEOs specific recommendations — not just charts. You know exactly what bothers each team and have the data to make decisions.",
        },
      ] as HeroSlide[],
      primaryCta: "Test 1 team for free",
      ctaMicro: "No commitment. Results are instant.",
      secondaryCta: "Book a demo",
      socialProof: "50,000+ people assessed",
      trust: [
        { icon: Shield, text: "GDPR compliant" },
        { icon: Clock, text: "Instant results in dashboard" },
        { icon: Zap, text: "For companies 50–500 people" },
      ],
    },
    de: {
      badge: "Für CEOs und HR, die nicht raten wollen",
      slides: [
        {
          headline: "Ihre besten Leute denken",
          headlineHighlight: "über einen Wechsel nach.",
          subtitle: "Echo Pulse sammelt Feedback über einen kurzen AI-Chat einmal im Monat. Ergebnisse erscheinen sofort in Ihrem Dashboard — nach Team, Thema und Risiko. Hören Sie auf zu raten.",
        },
        {
          headline: "Fluktuation kostet Ihr Unternehmen",
          headlineHighlight: "Hunderttausende pro Jahr.",
          subtitle: "Echo Pulse erkennt Risikosignale, bevor Ihre Schlüsselpersonen kündigen. Ein kurzer AI-Chat pro Monat genügt — Sie sehen, wo es brennt, und handeln.",
        },
        {
          headline: <>HR-Berichte voller Zahlen,<br className="hidden md:block" />{' '}aber{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent/70">keine Antworten?</span></>,
          headlineHighlight: "",
          subtitle: "Echo Pulse gibt HR und CEOs konkrete Empfehlungen — nicht nur Diagramme. Sie wissen genau, was jedes Team belastet, und haben die Daten für Entscheidungen.",
        },
      ] as HeroSlide[],
      primaryCta: "1 Team kostenlos testen",
      ctaMicro: "Unverbindlich. Ergebnisse sofort sichtbar.",
      secondaryCta: "Demo buchen",
      socialProof: "50.000+ getestete Personen",
      trust: [
        { icon: Shield, text: "DSGVO-konform" },
        { icon: Clock, text: "Ergebnisse sofort im Dashboard" },
        { icon: Zap, text: "Für Unternehmen 50–500 MA" },
      ],
    },
  };

  const c = copy[language] || copy.en;

  /* ─── Carousel state ─── */
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const slideCount = c.slides.length;

  const goToSlide = useCallback((index: number) => {
    setDirection(index > activeSlide ? 1 : -1);
    setActiveSlide(index);
  }, [activeSlide]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideCount]);

  const slide = c.slides[activeSlide];
  const heroImage = language === 'cz'
    ? { src: heroDashboardCz, width: 2400, height: 1456 }
    : { src: heroDashboardEn, width: 2400, height: 1453 };

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-8 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-background-secondary via-white to-brand-background-secondary -z-20" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[15%] w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="container-default relative z-10">
        <div className="flex flex-col items-center gap-12 lg:gap-16">
          
          {/* Top: Copy - Centered */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-brand-border shadow-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-brand-text-muted">
                {c.badge}
              </span>
            </motion.div>

            {/* Headline carousel */}
            <div className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px] flex flex-col justify-start">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeSlide}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-extrabold tracking-[-0.03em] text-brand-text-primary leading-[1.05] mb-6 font-display">
                    {slide.headline}
                    {slide.headlineHighlight && <br />}
                    {slide.headlineHighlight && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">
                        {slide.headlineHighlight}
                      </span>
                    )}
                  </h1>

                  <p className="text-base md:text-xl text-brand-text-body leading-relaxed max-w-2xl mx-auto">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel dots */}
            <div className="flex items-center justify-center gap-2 mb-10 mt-6">
              {c.slides.map((_: HeroSlide, idx: number) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className="group relative p-1"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      idx === activeSlide
                        ? "w-8 h-2 bg-brand-primary"
                        : "w-2 h-2 bg-brand-primary/25 group-hover:bg-brand-primary/50"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-8 justify-center"
            >
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all">
                <a href="https://app.behavera.com/echo-pulse/try" target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  {c.primaryCta}
                </a>
              </Button>
              
              <Button
                onClick={() => openBooking('hero')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-6 text-base font-semibold border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 rounded-2xl"
              >
                {c.secondaryCta}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            {/* Micro-copy + Trust */}
            <p className="text-xs text-brand-text-muted mb-6">{c.ctaMicro}</p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-primary">
                <Users className="w-4 h-4" />
                <span>{c.socialProof}</span>
              </div>
              <span className="hidden sm:inline text-brand-border">|</span>
              {c.trust.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <item.icon className="w-4 h-4 text-brand-primary/70" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom: Device Stage - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            <DeviceFrame type="macbook" className="w-full max-w-[500px] sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1200px] mx-auto">
              <AnimatedDashboardContent 
                imageSrc={heroImage.src} 
                imageAlt={language === 'cz' ? "Echo Pulse Dashboard - Rizikové signály a týmová analytika" : language === 'de' ? "Echo Pulse Dashboard - Risikosignale und Team-Analytics" : "Echo Pulse Dashboard - Risk signals and team analytics"}
                width={heroImage.width}
                height={heroImage.height}
                fetchPriority="high"
              />
            </DeviceFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
