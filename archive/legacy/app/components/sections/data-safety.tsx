import React from "react";
import { 
  Database, 
  ShieldBan, 
  VenetianMask, 
  Server, 
  Lock, 
  Scale,
  Check,
  X
} from "lucide-react";

interface SafetyCardProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
  isNegative?: boolean; // For "What we don't collect"
}

const SafetyCard = ({ icon, title, items, isNegative = false }: SafetyCardProps) => (
  <div className="card-base hover:shadow-md transition-all duration-300 h-full flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${isNegative ? "bg-red-50 text-red-600" : "bg-brand-background-secondary text-brand-primary"}`}>
        {icon}
      </div>
      <h3 className="text-h3 text-brand-text-primary">{title}</h3>
    </div>
    <ul className="space-y-3 flex-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-body text-brand-text-secondary">
          <div className={`mt-1.5 min-w-1.5 w-1.5 h-1.5 rounded-full ${isNegative ? "bg-red-400" : "bg-brand-primary"}`} />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const DataSafetySection = () => {
  const safetyFeatures = [
    {
      icon: <Database size={24} />,
      title: "Co sbíráme",
      items: [
        "E-mail zaměstnance (jen pro přístup)",
        "Odpovědi v pulzu (data + text)",
        "Provozní metadata (čas, tým, jazyk)"
      ]
    },
    {
      icon: <ShieldBan size={24} />,
      title: "Co nesbíráme",
      isNegative: true,
      items: [
        "Žádná data o pacientech",
        "Žádná zdravotní dokumentace",
        "Mzdy ani výkonová hodnocení"
      ]
    },
    {
      icon: <VenetianMask size={24} />,
      title: "Anonymita",
      items: [
        "Oddělená identita od feedbacku",
        "Management vidí jen agregace",
        "Ochrana malých týmů (skryté výsledky)"
      ]
    },
    {
      icon: <Server size={24} />,
      title: "Infrastruktura",
      items: [
        "Google Cloud Platform (region EU)",
        "Databáze PostgreSQL + zálohy",
        "Data uložena výhradně v EU"
      ]
    },
    {
      icon: <Lock size={24} />,
      title: "Zabezpečení",
      items: [
        "Šifrování AES-256 (v klidu)",
        "Přenos dat přes TLS 1.2+",
        "Přísně kontrolované přístupy (NDA)"
      ]
    },
    {
      icon: <Scale size={24} />,
      title: "Compliance & AI",
      items: [
        "GDPR: Behavera je zpracovatel",
        "AI souhrny jen z anonymních dat",
        "DPO kontakt: privacy@behavera.com"
      ]
    }
  ];

  return (
    <section className="section-spacing bg-white border-t border-brand-border">
      <div className="container-default">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-h2 text-brand-text-primary mb-4">
            Vaše data jsou v bezpečí
          </h2>
          <p className="text-body text-brand-text-secondary">
            Bezpečnost a soukromí nejsou jen funkce, ale základ našeho systému. 
            Splňujeme přísné standardy pro zdravotnictví i velké organizace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {safetyFeatures.map((feature, index) => (
            <SafetyCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              items={feature.items}
              isNegative={feature.isNegative}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-caption text-brand-text-muted">
            Máte specifické požadavky na bezpečnost? Napište nám na <a href="mailto:privacy@behavera.com" className="underline hover:text-brand-primary transition-colors">privacy@behavera.com</a>
          </p>
        </div>
      </div>
    </section>
  );
};
