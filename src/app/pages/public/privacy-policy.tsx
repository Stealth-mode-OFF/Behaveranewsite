import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/app/LanguageContext';
import { useSEO } from '@/app/hooks/useSEO';

export function PrivacyPolicyPage() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isCz = language === 'cz';
  const isDe = language === 'de';
  const pageTitle = isCz
    ? 'Ochrana osobních údajů – Echo Pulse'
    : isDe
    ? 'Datenschutz – Echo Pulse'
    : 'Privacy Policy – Echo Pulse';
  const pageDescription = isCz
    ? 'Zásady ochrany osobních údajů služby Echo Pulse.'
    : isDe
    ? 'Datenschutzrichtlinie für den Echo Pulse Service.'
    : 'Privacy Policy for the Echo Pulse Service.';

  useSEO({
    title: pageTitle,
    description: pageDescription,
    ogType: 'article',
  });

  return (
    <div className="min-h-screen bg-brand-background-primary font-sans text-brand-text-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-brand-border">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-brand-primary gap-2">
              <ArrowLeft className="w-4 h-4" />
              {isCz ? "Zpět na hlavní stránku" : isDe ? "Zurück zur Startseite" : "Back to Home"}
            </Button>
          </Link>
        </div>

        {isCz ? (
        <div className="space-y-8 text-brand-text-primary leading-relaxed">
            <section>
                <h1 className="text-3xl font-bold mb-4">Ochrana osobních údajů</h1>
                <p className="mb-4 text-brand-text-secondary">
                    Děkujeme vám za váš zájem o naše služby v oblasti kariérního rozvoje a sebepoznání. Věříme, že pro vás budou naše služby užitečné. Naším cílem je, abyste byli s našimi službami spokojeni a cítili se dobře. Proto jsme se snažili tento dokument, který právě čtete, napsat jasně a srozumitelně v duchu našich hodnot a poslání.
                </p>
                <p className="mb-4">
                    Tyto zásady ochrany osobních údajů popisují naše služby a to, jaké osobní údaje zpracováváme, jak a k čemu je používáme a jak vaše osobní údaje uchováváme v bezpečí. Jedná se o informace ve smyslu článku 13 nařízení Evropského parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů (dále jen „GDPR"). Aktuální znění ochrany osobních údajů vždy snadno najdete na odkazu: <a href="https://behavera.com/privacy-policy" className="text-brand-primary underline">behavera.com/privacy-policy</a>.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Kdo je správcem vašich osobních údajů?</h2>
                <p className="mb-4">
                    Správcem jsme my, společnost Behavera s.r.o., se sídlem Křižíkova 148/34, Karlín, 186 00 Praha 8, Česká republika, IČO: 03525520, spisová značka C 233138 vedená u Městského soudu v Praze.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Komisař pro ochranu osobních údajů</h2>
                <p className="mb-4">
                    Máme vlastního pověřence pro ochranu osobních údajů. Můžete se na něj obrátit v souvislosti s dotazy týkajícími se zpracování vašich osobních údajů, s doplňujícími informacemi nebo s žádostí o uplatnění některého ze zaručených práv. Komisaře můžete kontaktovat e-mailem na adrese: <a href="mailto:gdpr@behavera.com" className="text-brand-primary underline">gdpr@behavera.com</a>.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Proč zpracováváme vaše osobní údaje?</h2>
                <p className="mb-4">
                    Účely, pro které jsou osobní údaje zpracovávány, souvisejí se službami, které vám nabízíme a které pro vás zajistil náš klient, váš současný nebo potenciální zaměstnavatel. Jedná se o služby v oblasti vašeho kariérního rozvoje a sebepoznání nebo v rámci výběrového řízení na pozici, o kterou jste se ucházeli. Vaše osobní údaje zpracováváme pouze v případě, že nám k tomu dáte souhlas.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Jaké osobní údaje zpracováváme?</h2>
                <p className="mb-4">
                    Zpracováváme váš e-mail, jméno, příjmení, požadovanou adresu a váš věk, údaje o vzdělání, pracovní historii a další informace, které obdržíme od našeho klienta, což může být vaše pracovní pozice nebo jiné informace. Můžeme také pasivně zpracovávat vaši IP adresu a další technická metadata, jako je typ prohlížeče, nastavení časového pásma, operační systém atd.
                </p>
                <p className="mb-4">
                    Své osobní údaje můžete vidět pouze vy a profil slouží pouze vašim potřebám v našem prostředí v závislosti na tom, jaké služby si u vás náš klient objedná.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Jak je to s automatizovaným rozhodováním a profilováním?</h2>
                <p className="mb-4">
                    Vaše osobní údaje nepodléhají automatickému rozhodování, včetně profilování ve smyslu čl. 22 odst. 1 a 4 nařízení GDPR.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Komu předáváme vaše osobní údaje?</h2>
                <p className="mb-4">
                    Vaše osobní údaje předáváme zpět našemu klientovi, který si pro vás objednal naše služby.
                </p>
                <p className="mb-4">
                    Agregované údaje a pasivně shromážděné informace lze použít k vytváření obecných statistických zpráv. Tyto zprávy jsou anonymizované a neobsahují vaše osobní údaje ve smyslu nařízení GDPR.
                </p>
                <p className="mb-4">
                    Stejně jako mnoho jiných podniků si někdy najímáme jiné společnosti („poskytovatele služeb"), aby pro nás vykonávaly určité funkce související s provozem našich služeb. Příkladem jsou služby zákaznického servisu, údržba databází, ukládání dat, cloudové služby a hostingové služby. Pokud si na výkon některé z těchto funkcí najmeme poskytovatele služeb, poskytujeme jim pouze informace, které potřebují k výkonu svých konkrétních povinností, které mohou zahrnovat vaše osobní údaje, ale v naprosté většině situací je neobsahují. Poskytovatelé služeb jsou oprávněni tyto informace používat pouze v rozsahu nezbytném pro poskytování svých služeb pro nás a tuto činnost vykonávají na základě řádně uzavřené smlouvy o zpracování osobních údajů.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Jak dlouho vaše osobní údaje zpracováváme?</h2>
                <p className="mb-4">
                    Vaše osobní údaje jsou u nás uloženy po dobu vaší registrace, která byla vytvořena v souladu s našimi podmínkami používání, s nimiž jste se seznámili při registraci. Po ukončení vaší registrace z jakéhokoli důvodu uchováváme vaše osobní údaje po dobu 6 měsíců. Jakmile uplyne doba uchovávání vašich osobních údajů nebo doba, po kterou jsme povinni je uchovávat podle právních předpisů, vaše osobní údaje anonymizujeme nebo vymažeme z našich databází a systémů.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Kontaktujte nás a požádejte o přístup k vašim údajům, jejich přenos a vymazání</h2>
                <p className="mb-4">
                    Pokud chcete uplatnit své právo na přístup k vašim osobním údajům, které zpracováváme, na jejich přenos nebo výmaz, můžete nás kontaktovat zasláním žádosti elektronicky na adresu <a href="mailto:gdpr@behavera.com" className="text-brand-primary underline">gdpr@behavera.com</a>. Náš pověřenec pro ochranu osobních údajů vaši žádost vyřídí a odpoví na ni co nejdříve.
                </p>
                <p className="mb-4">
                    V souladu s vaší žádostí vám poskytneme přístup k vašim osobním údajům, předáme je vám nebo jinému správci nebo je vymažeme z našich systémů, pokud nejsme ze zákona povinni je uchovávat. Budeme vás také informovat o krocích, které jsme podnikli, abychom vaší žádosti vyhověli.
                </p>
                <p className="mb-4">
                    Vezměte prosím na vědomí, že v některých případech nemusíme být schopni plně vyhovět vaší žádosti, pokud by to bylo v rozporu s našimi zákonnými povinnostmi nebo našimi oprávněnými zájmy. V takových případech vám poskytneme vysvětlení, proč nemůžeme vaší žádosti plně vyhovět.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Jaká jsou vaše práva?</h2>
                <p className="mb-4">
                    Vaše údaje zpracováváme transparentně, správně, v souladu s nařízením GDPR a obecně závaznými právními předpisy. Máte právo na přístup ke svým údajům a na jejich opravu. V případech zpracování vašich údajů, ke kterému jste udělili souhlas, máte právo tento souhlas kdykoli odvolat.
                </p>
                <p className="mb-4">
                    Právo na přístup ke svým údajům a další práva můžete uplatnit zasláním žádosti elektronicky na adresu <a href="mailto:gdpr@behavera.com" className="text-brand-primary underline">gdpr@behavera.com</a>, stejně jako další dotazy. Pokud se domníváte, že zpracování vašich údajů je nesprávné, můžete podat stížnost u Úřadu pro ochranu osobních údajů.
                </p>
            </section>
        </div>
        ) : (
        <div className="space-y-8 text-brand-text-primary leading-relaxed">
            <section>
                <h1 className="text-3xl font-bold mb-4">Protection of personal data</h1>
                <p className="mb-4 text-brand-text-secondary">
                    Thank you for your interest in our services in the field of career development and self-knowledge. We believe that you will find our services useful. Our goal is for you to be satisfied with our services and feel good. That is why we tried to write this document, which you are reading right now, clearly and comprehensively in the spirit of our values and mission.
                </p>
                <p className="mb-4">
                    This Privacy Policy describes our services and what personal data we process, how and for what we use it, and how we keep your personal data safe. This is information within the meaning of Article 13 of Regulation (EU) 2016/679 of the European Parliament and of the Council on the protection of natural persons in connection with the processing of personal data (hereinafter referred to as &quot;GDPR&quot;). You can always easily find the current wording of the Personal Data Protection at the link: <a href="https://behavera.com/privacy-policy" className="text-brand-primary underline">behavera.com/privacy-policy</a>.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Who is the Administrator of your personal data?</h2>
                <p className="mb-4">
                    The administrator is us, the company Behavera s.r.o., with registered office at Křižíkova 148/34, Karlín, 186 00 Prague 8, Czech Republic, IČO: 03525520, file number C 233138 kept at the Municipal Court in Prague.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Commissioner for the protection of personal data</h2>
                <p className="mb-4">
                    We have our own personal data officer. You can contact him in connection with questions regarding the processing of your personal data, additional information or with a request to exercise any of the guaranteed rights. You can contact the commissioner by email at the address: <a href="mailto:gdpr@behavera.com" className="text-brand-primary underline">gdpr@behavera.com</a>.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Why do we process your personal data?</h2>
                <p className="mb-4">
                    The purposes for which personal data are processed relate to the services we offer you and which our Client, your current or potential employer has provided for you. These are services in the field of your career development and self-knowledge or within the selection process for the position you have applied for. We process your personal data only if you give us your consent.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">What personal data do we process?</h2>
                <p className="mb-4">
                    We process your email, first name, last name, desired address and your age, education data, work history and other information that we receive from our Client, which may be your job title or other information. We may also passively process your IP address and other technical metadata, such as browser type, time zone settings, operating system, etc.
                </p>
                <p className="mb-4">
                    Only you can see your personal data, and the profile only serves your needs in our environment, depending on what Services our Client orders for you.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">What about automated decision making and profiling?</h2>
                <p className="mb-4">
                    Your personal data are not subject to automatic decision-making, including profiling in the sense of Article 22, Paragraphs 1 and 4 of the GDPR Regulation.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">To whom do we transfer your personal data?</h2>
                <p className="mb-4">
                    We pass your personal data back to our Client who ordered our Services for you.
                </p>
                <p className="mb-4">
                    Aggregated data and passively collected information can be used to create general statistical reports. These reports are anonymized and do not contain your personal data within the meaning of the GDPR regulation.
                </p>
                <p className="mb-4">
                    Like many businesses, we sometimes hire other companies (&quot;service providers&quot;) to perform certain functions for us related to the operation of our Services. Examples include customer service, database maintenance, data storage, cloud services and hosting services. If we have a service provider to perform any of these functions, we only provide them with the information they need to perform their specific duties, which may include, but in the vast majority of situations do not include, your personal information. Service providers are authorized to use this information only as necessary to provide their services to us, and they perform this activity on the basis of a properly concluded personal data processing agreement.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">How long do we process your personal data?</h2>
                <p className="mb-4">
                    Your personal data is stored with us for the duration of your registration, which was created in accordance with our Terms of Use, which you familiarized yourself with during registration. After the termination of your registration for any reason, we keep your personal data for a period of 6 months. As soon as the period for storing your personal data or the period for which we are obliged to keep it according to legal regulations, we anonymize or delete your personal data from our databases and systems.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">Contacting us to request access, transfer, and deletion of your data</h2>
                <p className="mb-4">
                    If you wish to exercise your right to access, transfer, or delete your personal data that we process, you can contact us by sending a request electronically to <a href="mailto:gdpr@behavera.com" className="text-brand-primary underline">gdpr@behavera.com</a>. Our personal data officer will handle your request and respond to it as soon as possible.
                </p>
                <p className="mb-4">
                    We will provide you with access to your personal data, transfer it to you or to another controller, or delete it from our systems in accordance with your request, unless we are legally obligated to keep it. We will also inform you about the steps we have taken to comply with your request.
                </p>
                <p className="mb-4">
                    Please note that in some cases, we may not be able to fully comply with your request if it interferes with our legal obligations or our legitimate interests. In such cases, we will provide you with an explanation of why we cannot fully comply with your request.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-3">What are your rights?</h2>
                <p className="mb-4">
                    We process your data transparently, correctly, in accordance with the GDPR regulation and generally binding legal regulations. You have the right to access and correct your data. In cases of processing of your data for which you have given consent, you are entitled to withdraw this consent at any time.
                </p>
                <p className="mb-4">
                    You can exercise the right to access your data and your other rights by sending a request electronically to <a href="mailto:gdpr@behavera.com" className="text-brand-primary underline">gdpr@behavera.com</a>, as well as any other questions. If you believe that the processing of your data is incorrect, you can file a complaint with the Office for Personal Data Protection.
                </p>
            </section>
        </div>
        )}

        <div className="mt-12 pt-8 border-t border-brand-border">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isCz ? "Zpět na hlavní stránku" : isDe ? "Zurück zur Startseite" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
