import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/app/LanguageContext';
import { useSEO } from '@/app/hooks/useSEO';

export function TermsPage() {
  const { language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isCz = language === 'cz';
  const isDe = language === 'de';
  const pageTitle = isCz
    ? 'Podmínky Behavera'
    : isDe
    ? 'Behavera AGB'
    : 'Behavera Terms';
  const pageDescription = isCz
    ? 'Podmínky a pravidla služby Behavera.'
    : isDe
    ? 'Allgemeine Geschäftsbedingungen für Behavera.'
    : 'Terms and Conditions for the Behavera Service.';

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

        <h1 className="text-3xl font-bold mb-2">
            {isCz ? "Podmínky a pravidla Služby Behavera" : "Terms and Conditions of the Behavera Service"}
        </h1>
        <p className="text-sm text-brand-text-secondary mb-8">
            {isCz ? "Podmínky a pravidla Služeb Assessmentů jsou k dispozici zde: " : "Terms and Conditions of the Assessments are available here: "}
            <a href={isCz ? "https://cz.behavera.com/t-c-assessments" : "https://behavera.com/t-c-assessments"} className="text-brand-primary underline">
                {isCz ? "cz.behavera.com/t-c-assessments" : "behavera.com/t-c-assessments"}
            </a>
        </p>

        {isCz ? (
            <div className="space-y-8 text-brand-text-primary leading-relaxed">
            <section>
                <h2 className="text-xl font-bold mb-4">Obchodní podmínky společnosti Behavera s.r.o.</h2>
                <p className="mb-4">
                    Sídlo: Křižíkova 148/34, Karlín, Praha 8, Česká republika, IČO: 03525520, zapsaná v obchodním rejstříku vedeném Městským soudem v Praze, spisová značka C 233138
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">1. Úvodní ustanovení</h3>
                <p className="mb-3">
                    Těmito obchodními a produktovými podmínkami (dále společně jen „Podmínky“) se řídí vztahy při poskytování a využívání Služby Behavera společnosti Behavera.
                </p>
                <p className="mb-3">
                    „Služba“ znamená službu Behavera poskytovanou společností Behavera formou vzdáleného přístupu prostřednictvím webového rozhraní, jejímž účelem je umožnit Klientovi získávat anonymní zpětnou vazbu od Účastníků a přehledné analytické výstupy a doporučení související s fungováním týmů a vedením lidí.
                </p>
                <p className="mb-3">
                    Služba je poskytována v rozsahu a podobě dostupné Klientovi v daném čase a její konkrétní technické řešení, struktura a funkce se mohou v průběhu času měnit.
                </p>
                <p className="mb-3">
                    „Účastníkem“ se rozumí fyzická osoba, kterou Klient pozve k účasti na pulse měření nebo jiném hodnocení realizovaném prostřednictvím Služby (dále jen „Účastník“). Účastníkem může být zejména zaměstnanec Klienta nebo jiná osoba spolupracující s Klientem, které je účast na Službě umožněna na základě smluvního vztahu mezi společností Behavera a Klientem.
                </p>
                <p>
                    Odchylné písemné dohody uzavřené mezi společností Behavera a Klientem mají přednost před ustanoveními těchto Podmínek.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">2. Uzavření smlouvy a podmínky používání služby</h3>
                <h4 className="font-semibold mb-2">Uzavření smlouvy</h4>
                <p className="mb-3">
                    Smluvní vztah mezi společností Behavera a Klientem vzniká okamžikem, kdy Klient v rámci online registračního procesu vyjádří souhlas s těmito Podmínkami prostřednictvím potvrzovacího prvku v internetovém rozhraní a současně dojde k úhradě první platby za Službu, pokud není mezi stranami výslovně sjednáno jinak.
                </p>
                <p className="mb-3">
                    Uzavřením smlouvy se její součástí stávají rovněž údaje o ceně Služby a jejím rozsahu, které byly Klientovi zobrazeny v rámci online registračního procesu nebo mu byly poskytnuty individuálně společností Behavera před uzavřením smlouvy.
                </p>
                <p className="mb-3">
                    V případě rozporu mezi individuální cenovou nabídkou poskytnutou Klientovi společností Behavera a údaji zobrazenými v rámci online registračního procesu má přednost individuální cenová nabídka.
                </p>

                <h4 className="font-semibold mb-2">Registrace Klienta a využívání Služby</h4>
                <p className="mb-3">
                    Registrací Klienta v internetovém rozhraní Služby vzniká Klientovi uživatelský přístup, prostřednictvím kterého je oprávněn Službu využívat v rozsahu sjednaném podle těchto Podmínek.
                </p>
                <p className="mb-3">
                    Klient je povinen uvádět při registraci pravdivé a aktuální údaje a odpovídá za jednání osob, kterým umožní ke Službě přístup.
                </p>
                <p className="mb-3">
                    Klient je oprávněn prostřednictvím Služby umožnit účast třetích osob (Účastníků), zejména formou individuálního odkazu, za účelem jejich zapojení do pulse měření nebo hodnocení. Účastník může hodnocení přerušit a pokračovat v něm později, pokud to technické nastavení Služby umožňuje, a není povinen jej dokončit.
                </p>

                <h4 className="font-semibold mb-2">Výstupy a odpovědnost</h4>
                <p className="mb-3">
                    V případě dokončení hodnocení má Klient přístup k automaticky generovaným výstupům odpovídajícím aktuálním funkcionalitám Služby. Pokud hodnocení dokončeno není, mohou být zpřístupněny pouze omezené údaje.
                </p>
                <p className="mb-3">
                    Klient se zavazuje využívat Službu v souladu s právními předpisy, dobrými mravy a jejím účelem a odpovídá za obsah zpřístupněný prostřednictvím Služby.
                </p>
                <p className="mb-3">
                    Společnost Behavera je oprávněna v odůvodněných případech omezit nebo pozastavit přístup ke Službě při jejím zneužívání nebo podstatném porušení těchto Podmínek.
                </p>

                <h4 className="font-semibold mb-2">Technická povaha Služby a data</h4>
                <p className="mb-3">
                    Klient bere na vědomí, že Služba je poskytována formou cloudové služby a její dostupnost může být ovlivněna technickými okolnostmi mimo kontrolu společnosti Behavera.
                </p>
                <p>
                    Společnost Behavera je oprávněna anonymizovat data vzniklá při poskytování Služby a tato anonymizovaná data dále využívat pro statistické účely a zlepšování Služby, v souladu s právními předpisy.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">3. Cena Služby a platební podmínky</h3>
                <h4 className="font-semibold mb-2">Cena Služby a její stanovení</h4>
                <p className="mb-3">
                    Cena Služby je stanovena na základě rozsahu využívání Služby sjednaného mezi Klientem a společností Behavera, zejména s ohledem na referenční počet Účastníků, zvolenou variantu předplatného (měsíční nebo roční) a další parametry Služby zvolené Klientem.
                </p>
                <p className="mb-3">
                    Referenčním počtem Účastníků se rozumí počet Účastníků uvedený Klientem a odsouhlasený při uzavření smlouvy, zejména v rámci online registračního procesu nebo individuální cenové nabídky, který slouží jako základ pro stanovení sjednané ceny Služby.
                </p>
                <p className="mb-3">
                    Sjednaná cena Služby je fixní cenou za sjednaný rozsah Služby a váže se k referenčnímu počtu Účastníků.
                </p>
                <p className="mb-3">
                    Pokles skutečného počtu Účastníků oproti referenčnímu počtu nemá vliv na sjednanou cenu Služby.
                </p>
                <p className="mb-3">
                    V případě, že skutečný počet Účastníků využívajících Službu v rámci jednoho fakturačního měsíce překročí referenční počet Účastníků o více než deset procent (10 %), je společnost Behavera oprávněna upravit sjednanou cenu Služby tak, aby odpovídala rozšířenému rozsahu využívání Služby. Pro účely tohoto ustanovení se vychází z nejvyššího skutečného počtu Účastníků zaznamenaného v daném fakturačním měsíci.
                </p>
                <p className="mb-3">
                    Úprava ceny se provede poměrně, a to tak, že procentní navýšení ceny odpovídá procentnímu navýšení skutečného počtu Účastníků nad referenční počet. Takto upravená cena se považuje za novou sjednanou cenu Služby a váže se k aktualizovanému referenčnímu počtu Účastníků, bez ohledu na případný pozdější pokles skutečného počtu Účastníků. Strany berou na vědomí a souhlasí s tím, že úprava ceny podle tohoto článku je přímým důsledkem změny rozsahu využívání Služby a nepředstavuje jednostrannou změnu smlouvy ani obchodních podmínek.
                </p>
                <p className="mb-3">
                    V případě ročního předplatného je společnost Behavera oprávněna dofakturovat navýšení ceny odpovídající rozšířenému rozsahu Služby i v průběhu předplaceného dvanáctiměsíčního období, a to poměrně za zbývající část tohoto období.
                </p>
                <p className="mb-3">
                    Společnost Behavera je povinna Klienta o úpravě ceny informovat alespoň třicet (30) dnů předem, přičemž nová cena se uplatní od data uvedeného v oznámení.
                </p>

                <h4 className="font-semibold mb-2">Platební podmínky</h4>
                <p className="mb-3">
                    Cena Služby je hrazena na základě faktury vystavené společností Behavera, která je zasílána elektronicky. Fakturace probíhá podle zvolené varianty předplatného, tj.: u měsíčního předplatného měsíčně, u ročního předplatného předem na dvanáct (12) měsíců. Faktura je splatná do čtrnácti (14) dnů ode dne vystavení.
                </p>
                <p className="mb-3">
                    Je-li Klient v prodlení s úhradou ceny déle než čtrnáct (14) dnů, je společnost Behavera oprávněna pozastavit poskytování Služby až do úplného zaplacení dlužné částky. Po dobu pozastavení Služby nemá Klient nárok na slevu ani na prodloužení doby poskytování Služby.
                </p>

                <h4 className="font-semibold mb-2">Zkušební období a odstoupení bez uvedení důvodu</h4>
                <p className="mb-3">
                    Klient je oprávněn do třiceti (30) dnů ode dne úhrady první platby odstoupit od smlouvy bez uvedení důvodu a požádat o vrácení zaplacené částky, pokud:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>byla provedena implementace Služby, a</li>
                    <li>bylo dokončeno první Pulse měření.</li>
                </ul>
                <p className="mb-3">
                    Nedojde-li k dokončení prvního Pulse měření, nárok na vrácení zaplacené částky nevzniká. Po uplynutí lhůty podle tohoto článku nárok Klienta na vrácení zaplacené částky zaniká a smluvní vztah pokračuje za sjednaných podmínek.
                </p>

                <h4 className="font-semibold mb-2">Rozsah ceny a bezplatná účast účastníků</h4>
                <p className="mb-3">
                    Cena Služby se vztahuje výhradně na poskytování Služby Klientovi. Vyplnění hodnocení Účastníkem je za všech okolností bezplatné a nemůže být účtováno žádné ze zúčastněných stran. Klient není oprávněn požadovat po Účastníkovi v souvislosti s provedením hodnocení žádné další plnění.
                </p>

                <h4 className="font-semibold mb-2">Nevyužití Služby</h4>
                <p>
                    Klient nemá nárok na vrácení zaplacené Ceny ani na slevu z Ceny v případě, že objednané Služby nevyužije, zejména z důvodu technických překážek na jeho straně a/nebo nedokončení hodnocení jeho Účastníky.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">4. Bezpečnost informací</h3>
                <h4 className="font-semibold mb-2">Mlčenlivost</h4>
                <p className="mb-3">
                    Smluvní strany se zavazují zachovávat mlčenlivost o všech důvěrných informacích, které se dozvědí v souvislosti s uzavřením smlouvy a využíváním Služby. Povinnost mlčenlivosti trvá i po ukončení smluvního vztahu a nevztahuje se na případy, kdy je zpřístupnění informací vyžadováno právními předpisy.
                </p>

                <h4 className="font-semibold mb-2">Ochrana osobních údajů</h4>
                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Role smluvních stran</h5>
                <p className="mb-2">
                    Klient vystupuje jako správce osobních údajů ve smyslu GDPR, neboť určuje účel a prostředky zpracování osobních údajů Účastníků.
                    Společnost Behavera vystupuje jako zpracovatel osobních údajů a zpracovává osobní údaje výhradně na základě pokynů Klienta a v rozsahu nezbytném pro poskytování Služby Behavera.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Předmět, doba a účel zpracování</h5>
                <p className="mb-2">
                    Předmětem zpracování jsou osobní údaje Účastníků zapojených Klientem do využívání Služby. Zpracování probíhá po dobu trvání smluvního vztahu, případně po dobu nezbytnou k vypořádání práv a povinností po jeho ukončení. Účelem zpracování je poskytování Služby, zejména realizace pulse měření, vyhodnocení odpovědí Účastníků a zpřístupnění výstupů Klientovi.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Typy osobních údajů a subjekty údajů</h5>
                <p className="mb-2">
                    Zpracovávány mohou být zejména:
                </p>
                <ul className="list-disc pl-5 mb-2">
                    <li>omezené identifikační a kontaktní údaje,</li>
                    <li>odpovědi Účastníků v rámci Služby,</li>
                    <li>technické údaje související s využíváním Služby.</li>
                </ul>
                <p className="mb-2">
                    Zvláštní kategorie osobních údajů dle čl. 9 GDPR nejsou zpracovávány, ledaže by bylo výslovně sjednáno jinak. Subjekty údajů jsou Účastníci, tj. fyzické osoby zapojené Klientem do Služby.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Povinnosti zpracovatele</h5>
                <p className="mb-2">
                    Společnost Behavera se zavazuje:
                </p>
                <ul className="list-disc pl-5 mb-2">
                    <li>zpracovávat osobní údaje pouze na základě dokumentovaných pokynů Klienta,</li>
                    <li>zajistit mlčenlivost osob oprávněných ke zpracování,</li>
                    <li>přijmout vhodná technická a organizační opatření dle čl. 32 GDPR,</li>
                    <li>poskytnout Klientovi přiměřenou součinnost při plnění povinností dle GDPR,</li>
                    <li>bez zbytečného odkladu oznámit Klientovi porušení zabezpečení osobních údajů.</li>
                </ul>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Další zpracovatelé</h5>
                <p className="mb-2">
                    Klient uděluje společnosti Behavera obecné povolení k zapojení dalších zpracovatelů, zejména poskytovatelů technické a cloudové infrastruktury.
                    Společnost Behavera zajistí, aby další zpracovatelé byli vázáni povinnostmi odpovídajícími tomuto ustanovení.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Ukončení zpracování</h5>
                <p className="mb-2">
                    Po ukončení poskytování Služby společnost Behavera osobní údaje dle pokynu Klienta vymaže nebo vrátí, nebrání-li tomu právní předpisy.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Odpovědnost</h5>
                <p className="mb-2">
                    Klient odpovídá za splnění povinností správce osobních údajů, zejména za právní titul ke zpracování a splnění informační povinnosti vůči subjektům údajů.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">5. Ochrana duševního vlastnictví</h3>
                <p className="mb-3">
                    Veškerý obsah, funkcionality a technické řešení Služby, včetně metodik, nástrojů, testových otázek, algoritmů, databází, uživatelského rozhraní a dalších souvisejících prvků, jsou chráněny právními předpisy o ochraně duševního vlastnictví. Nositelem práv k těmto prvkům je společnost Behavera nebo její licenční partneři.
                </p>
                <p className="mb-3">
                    Klient je oprávněn po dobu trvání smluvního vztahu Službu užívat výhradně vzdáleným způsobem a pouze pro své interní účely, v souladu s těmito Podmínkami. Poskytnutím Služby nedochází k převodu jakýchkoli práv duševního vlastnictví na Klienta.
                </p>
                <p className="mb-3">
                    Klient se zejména zavazuje, že nebude:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>zpřístupňovat Službu nebo její části neoprávněným třetím osobám,</li>
                    <li>pořizovat kopie Služby nebo jejího obsahu,</li>
                    <li>provádět reverse engineering, dekompilaci nebo jiné zásahy do technického řešení Služby,</li>
                    <li>využívat Službu za účelem vývoje nebo provozu konkurenčního řešení.</li>
                </ul>
                <p>
                    Tím není dotčeno právo Klienta používat výstupy a výsledky vzniklé při využívání Služby pro své interní potřeby.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">6. Trvání smlouvy a její ukončení</h3>
                <h4 className="font-semibold mb-2">Trvání smlouvy</h4>
                <p className="mb-3">
                    Smluvní vztah mezi společností Behavera a Klientem se uzavírá na dobu neurčitou, není-li mezi smluvními stranami výslovně sjednáno jinak. Zvolená varianta předplatného (měsíční nebo roční) určuje způsob fakturace a platební období, nikoli dobu trvání smlouvy.
                </p>

                <h4 className="font-semibold mb-2">Ukončení smlouvy ze strany Klienta</h4>
                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">a) Měsíční předplatné</h5>
                <p className="mb-3">
                    V případě měsíčního předplatného je Klient oprávněn smlouvu písemně vypovědět za těchto podmínek:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>po dobu prvních tří (3) měsíců ode dne zahájení poskytování Služby může Klient smlouvu vypovědět kdykoli s okamžitou účinností, výpověď musí být společnosti Behavera doručena nejpozději poslední den této doby;</li>
                    <li>po uplynutí této tří měsíční doby je Klient oprávněn smlouvu vypovědět s výpovědní dobou dvou (2) měsíců, přičemž výpovědní doba počíná běžet prvním dnem kalendářního měsíce následujícího po kalendářním měsíci, ve kterém byla výpověď doručena společnosti Behavera.</li>
                </ul>
                <p className="mb-3">
                    Ukončení smlouvy nemá vliv na povinnost Klienta uhradit cenu za již poskytnuté nebo zaplacené období, pokud není v těchto Podmínkách výslovně stanoveno jinak.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">b) Roční předplatné</h5>
                <p className="mb-3">
                    V případě ročního předplatného je Klient oprávněn smlouvu písemně vypovědět tak, aby výpověď byla doručena společnosti Behavera nejpozději dva (2) měsíce před uplynutím aktuálního dvanáctiměsíčního předplaceného období poskytování Služby.
                </p>
                <p className="mb-3">
                    Není-li výpověď doručena v této lhůtě, rozsah poskytování Služby v režimu ročního předplatného se automaticky obnovuje na další dvanáctiměsíční období (a to i opakovaně).
                </p>

                <h4 className="font-semibold mb-2">Odstoupení od smlouvy ze strany společnosti Behavera</h4>
                <p className="mb-3">
                    Společnost Behavera je oprávněna od smlouvy odstoupit s okamžitou účinností, pokud:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>je Klient v prodlení s úhradou jakékoli splatné částky po dobu delší než čtrnáct (14) kalendářních dnů, nebo</li>
                    <li>Klient podstatným způsobem poruší své povinnosti vyplývající ze smlouvy nebo těchto Podmínek, zejména povinnosti týkající se plateb, řádného a oprávněného užívání Služby nebo ochrany práv společnosti Behavera.</li>
                </ul>

                <h4 className="font-semibold mb-2">Výpověď smlouvy ze strany společnosti Behavera bez uvedení důvodu</h4>
                <p className="mb-3">
                    Společnost Behavera je oprávněna smlouvu kdykoli písemně vypovědět i bez uvedení důvodu, a to s výpovědní dobou tří (3) měsíců. Výpovědní doba počíná běžet prvním dnem kalendářního měsíce následujícího po kalendářním měsíci, ve kterém byla výpověď doručena Klientovi.
                </p>
                <p className="mb-3">
                    V případě výpovědi smlouvy podle tohoto ustanovení je společnost Behavera povinna buď umožnit Klientovi využívat Službu po dobu odpovídající již uhrazenému období, nebo vrátit Klientovi poměrnou část již uhrazené Ceny za období, po které již Služba nebude poskytována.
                </p>
                <p className="mb-3">
                    Tím nejsou dotčena práva společnosti Behavera odstoupit od smlouvy podle předchozího článku.
                </p>
                <p className="mb-3">
                    Společnost Behavera je oprávněna smlouvu vypovědět podle tohoto ustanovení i v případě, že je smluvní vztah sjednán na dobu určitou, pokud není mezi smluvními stranami výslovně dohodnuto jinak.
                </p>

                <h4 className="font-semibold mb-2">Důsledky ukončení smlouvy</h4>
                <p className="mb-3">
                    Ukončení smlouvy z jakéhokoli důvodu nezakládá Klientovi nárok na vrácení již uhrazených plateb ani jejich poměrné části, s výjimkou případů výslovně uvedených v těchto Podmínkách.
                </p>
                <p>
                    Ukončením smlouvy zaniká právo Klienta využívat Službu; tím nejsou dotčeny povinnosti, které mají podle své povahy trvat i po ukončení smlouvy, zejména povinnosti týkající se mlčenlivosti, ochrany duševního vlastnictví a úhrady dlužných částek.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">7. Omezení odpovědnosti a vyloučení záruk</h3>
                <p className="mb-3">
                    Služba je poskytována jako cloudová služba ve stavu „jak je“ a „jak je dostupná“. Společnost Behavera neposkytuje žádné záruky ohledně nepřetržité dostupnosti, bezchybnosti Služby ani dosažení konkrétních výsledků. Výstupy, hodnocení a doporučení generované prostřednictvím Služby mají výhradně informativní charakter a nepředstavují odborné poradenství; veškerá rozhodnutí přijatá na jejich základě činí Klient na vlastní odpovědnost.
                </p>
                <p>
                    Celková odpovědnost společnosti Behavera za škodu vzniklou v souvislosti s poskytováním Služby je v maximálním rozsahu přípustném právními předpisy omezena na částku odpovídající ceně Služby uhrazené Klientem za jeden (1) kalendářní měsíc.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">8. Změna obchodních podmínek a Ceny</h3>
                <p className="mb-3">
                    Společnost Behavera je oprávněna v přiměřeném rozsahu jednostranně měnit tyto obchodní podmínky a/nebo Cenu Služby, zejména z následujících důvodů:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>změny právních předpisů, regulatorních požadavků nebo výkladové praxe orgánů veřejné moci,</li>
                    <li>změny technických, bezpečnostních nebo provozních parametrů Služby,</li>
                    <li>rozšíření, omezení, úpravy nebo optimalizace funkcionalit Služby nebo její struktury,</li>
                    <li>změny nákladů na vývoj, provoz, údržbu nebo podporu Služby,</li>
                    <li>změny obchodní nebo cenové strategie společnosti Behavera,</li>
                    <li>úpravy Ceny Služby reflektující tržní podmínky, ekonomický vývoj nebo strategické cíle společnosti Behavera,</li>
                    <li>změny rozsahu nebo způsobu využívání Služby Klientem.</li>
                </ul>
                <p className="mb-3">
                    Změna obchodních podmínek a/nebo Ceny Služby bude Klientovi oznámena nejméně třicet (30) dnů předem, a to prostřednictvím elektronické pošty zaslané na kontaktní e-mail Klienta a/nebo formou oznámení v uživatelském rozhraní Služby (např. prostřednictvím notifikace nebo pop-up okna).
                </p>

                <h4 className="font-semibold mb-2">Právo Klienta na ukončení smlouvy při změně Podmínek nebo Ceny</h4>
                <p className="mb-3">
                    V případě, že Klient se změnou obchodních podmínek a/nebo Ceny Služby nesouhlasí, je oprávněn smlouvu písemně vypovědět, a to nejpozději do dne nabytí účinnosti oznámené změny. V takovém případě smluvní vztah skončí ke dni účinnosti změny, není-li mezi smluvními stranami dohodnuto jinak.
                </p>
                <p className="mb-3">
                    Má-li Klient ke dni ukončení smlouvy uhrazenou Cenu za období, po které již nebude Služba poskytována, je společnost Behavera povinna Klientovi vrátit poměrnou část uhrazené Ceny odpovídající nevyčerpané části předplaceného období.
                </p>

                <h4 className="font-semibold mb-2">Akceptace změn</h4>
                <p className="mb-3">
                    Pokračuje-li Klient v užívání Služby po dni nabytí účinnosti změny obchodních podmínek a/nebo Ceny Služby, má se za to, že Klient se změnou souhlasí a změněné obchodní podmínky a/nebo Cena Služby se stávají závaznou součástí smluvního vztahu mezi Klientem a společností Behavera.
                </p>

                <h4 className="font-semibold mb-2">Omezení účinků změn</h4>
                <p>
                    Jednostranné změny obchodních podmínek a/nebo Ceny Služby se nedotýkají již splatných nároků ani plnění poskytnutých před nabytím účinnosti změny a nejsou dotčena práva smluvních stran vzniklá před tímto okamžikem.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">9. Závěrečná ustanovení</h3>
                <p className="mb-3">
                    Tyto obchodní podmínky nabývají platnosti a účinnosti dne 25. ledna 2026.
                </p>
                <p className="mb-3">
                    Tyto obchodní podmínky se použijí rovněž na veškeré smluvní vztahy mezi společností Behavera a Klienty vzniklé přede dnem jejich účinnosti, a to ode dne, kdy se Klient po nabytí jejich účinnosti poprvé přihlásí do Služby nebo ji jinak začne využívat.
                </p>
                <p>
                    V případě jakékoli nejednoznačnosti, nesrovnalosti nebo sporu ohledně výkladu nebo významu těchto Podmínek má přednost česká jazyková verze, která se považuje za rozhodnou. Aktuální verze Podmínek a pravidel Služby Behavera je k dispozici na adrese: <a href="https://cz.behavera.com/terms" className="text-brand-primary underline">cz.behavera.com/terms</a>.
                </p>
            </section>
        </div>
        ) : (
        <div className="space-y-8 text-brand-text-primary leading-relaxed">
            <section>
                <h2 className="text-xl font-bold mb-4">Commercial Terms and Conditions of Behavera s.r.o.</h2>
                <p className="mb-4">
                    Registered office: Křižíkova 148/34, Karlín, Prague 8, Czech Republic, Company ID No.: 03525520, Registered in the Commercial Register maintained by the Municipal Court in Prague, File No. C 233138
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">1. Introductory Provisions</h3>
                <p className="mb-3">
                    These commercial and product terms and conditions (hereinafter collectively referred to as the “Terms”) govern the legal relationships arising in connection with the provision and use of the Behavera service by Behavera.
                </p>
                <p className="mb-3">
                    The “Service” means the Behavera service provided by Behavera through remote access via a web-based interface, the purpose of which is to enable the Client to obtain anonymous feedback from Participants and to receive clear analytical outputs and recommendations related to team functioning and people management.
                </p>
                <p className="mb-3">
                    The Service is provided in the scope and form available to the Client at any given time. Its specific technical solution, structure, and functionalities may change over time.
                </p>
                <p className="mb-3">
                    A “Participant” means a natural person invited by the Client to participate in a Pulse survey or other assessment conducted through the Service (hereinafter the “Participant”). A Participant may in particular be an employee of the Client or another person cooperating with the Client whose participation in the Service is enabled on the basis of a contractual relationship between Behavera and the Client.
                </p>
                <p>
                    Any written agreements concluded individually between Behavera and the Client shall prevail over the provisions of these Terms.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">2. Conclusion of the Agreement and Conditions of Use of the Service</h3>
                <h4 className="font-semibold mb-2">Conclusion of the Agreement</h4>
                <p className="mb-3">
                    The contractual relationship between Behavera and the Client is formed at the moment when the Client expresses its consent to these Terms during the online registration process by means of a confirmation element in the web interface and the first payment for the Service is made, whichever occurs later, unless expressly agreed otherwise between the Parties.
                </p>
                <p className="mb-3">
                    Upon conclusion of the Agreement, the information regarding the Price of the Service and its scope displayed to the Client during the online registration process or provided individually by Behavera prior to the conclusion of the Agreement shall also form an integral part of the Agreement.
                </p>
                <p className="mb-3">
                    In the event of any discrepancy between an individual price offer provided to the Client by Behavera and the information displayed during the online registration process, the individual price offer shall prevail.
                </p>

                <h4 className="font-semibold mb-2">Client Registration and Use of the Service</h4>
                <p className="mb-3">
                    By registering the Client in the Service’s web interface, the Client obtains user access through which it is entitled to use the Service within the scope agreed in accordance with these Terms.
                </p>
                <p className="mb-3">
                    The Client is obliged to provide true and up-to-date information during registration and is responsible for the actions of persons to whom it grants access to the Service.
                </p>
                <p className="mb-3">
                    The Client is entitled to enable the Participants through the Service, in particular by means of an individual link, for the purpose of involving them in Pulse surveys or assessments. A Participant may interrupt an assessment and continue it later, if permitted by the technical settings of the Service, and is not obliged to complete it.
                </p>

                <h4 className="font-semibold mb-2">Outputs and Responsibility</h4>
                <p className="mb-3">
                    If an assessment is completed, the Client shall have access to automatically generated outputs corresponding to the current functionalities of the Service. If an assessment is not completed, only limited data may be made available.
                </p>
                <p className="mb-3">
                    The Client undertakes to use the Service in compliance with applicable legal regulations, good morals, and its intended purpose, and is responsible for the content made available through the Service.
                </p>
                <p className="mb-3">
                    Behavera is entitled, in justified cases, to restrict or suspend access to the Service in the event of misuse or a material breach of these Terms.
                </p>

                <h4 className="font-semibold mb-2">Technical Nature of the Service and Data</h4>
                <p className="mb-3">
                    The Client acknowledges that the Service is provided as a cloud-based service and that its availability may be affected by technical circumstances beyond Behavera’s control.
                </p>
                <p>
                    Behavera is entitled to anonymize data generated in connection with the provision of the Service and to further use such anonymized data for statistical purposes and for improving the Service, in compliance with applicable legal regulations.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">3. Price of the Service and Payment Terms</h3>
                <h4 className="font-semibold mb-2">Price of the Service and Its Determination</h4>
                <p className="mb-3">
                    The Price of the Service is determined based on the scope of use of the Service agreed between the Client and Behavera, in particular with regard to the reference number of Participants, the selected subscription variant (monthly or annual), and other parameters of the Service selected by the Client.
                </p>
                <p className="mb-3">
                    The reference number of Participants means the number of Participants specified by the Client and approved upon conclusion of the Agreement, in particular during the online registration process or in an individual price offer, which serves as the basis for determining the agreed Price of the Service.
                </p>
                <p className="mb-3">
                    The agreed Price of the Service is a fixed price for the agreed scope of the Service and is linked to the reference number of Participants.
                </p>
                <p className="mb-3">
                    A decrease in the actual number of Participants compared to the reference number shall have no effect on the agreed Price of the Service.
                </p>
                <p className="mb-3">
                    If the actual number of Participants using the Service within a single billing month exceeds the reference number of Participants by more than ten percent (10%), Behavera is entitled to adjust the agreed Price of the Service so that it corresponds to the expanded scope of use of the Service. For the purposes of this provision, the highest actual number of Participants recorded in the given billing month shall be taken into account.
                </p>
                <p className="mb-3">
                    The Price adjustment shall be made proportionally, so that the percentage increase in the Price corresponds to the percentage increase in the actual number of Participants above the reference number. The adjusted Price shall be deemed the new agreed Price of the Service and shall be linked to the updated reference number of Participants, regardless of any subsequent decrease in the actual number of Participants. The Parties acknowledge and agree that a Price adjustment under this Article is a direct consequence of a change in the scope of use of the Service and does not constitute a unilateral amendment of the Agreement or these Terms.
                </p>
                <p className="mb-3">
                    In the case of an annual subscription, Behavera is entitled to invoice the Price increase corresponding to the expanded scope of the Service even during the prepaid twelve-month period, proportionally for the remaining part of that period.
                </p>
                <p className="mb-3">
                    Behavera is obliged to inform the Client of any Price adjustment at least thirty (30) days in advance, with the new Price becoming applicable as of the date specified in the notice.
                </p>

                <h4 className="font-semibold mb-2">Payment Terms</h4>
                <p className="mb-3">
                    The Price of the Service shall be paid on the basis of an invoice issued by Behavera and delivered electronically. Invoicing shall be carried out according to the selected subscription variant, i.e. monthly for a monthly subscription and in advance for twelve (12) months for an annual subscription. The invoice shall be due and payable within fourteen (14) days of its issue date.
                </p>
                <p className="mb-3">
                    If the Client is in default with payment of the Price for more than fourteen (14) days, Behavera is entitled to suspend the provision of the Service until the outstanding amount has been paid in full. During the period of suspension, the Client shall not be entitled to any discount or extension of the Service period.
                </p>

                <h4 className="font-semibold mb-2">Trial Period and Withdrawal Without Stating Reasons</h4>
                <p className="mb-3">
                    The Client is entitled to withdraw from the Agreement without stating reasons within thirty (30) days from the date of payment of the first payment and to request a refund of the paid amount, provided that:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>a) the implementation of the Service has been completed, and</li>
                    <li>b) the first Pulse survey has been completed.</li>
                </ul>
                <p className="mb-3">
                    If the first Pulse survey is not completed, the right to a refund shall not arise. Upon expiry of the period specified in this Article, the Client’s right to a refund shall lapse and the contractual relationship shall continue under the agreed terms.
                </p>

                <h4 className="font-semibold mb-2">Scope of the Price and Free Participation of Participants</h4>
                <p className="mb-3">
                    The Price of the Service applies exclusively to the provision of the Service to the Client. Completion of an assessment by a Participant is free of charge under all circumstances and may not be charged to any of the Parties involved. The Client is not entitled to require any additional consideration from a Participant in connection with completing an assessment.
                </p>

                <h4 className="font-semibold mb-2">Non-Use of the Service</h4>
                <p>
                    The Client shall not be entitled to a refund of the paid Price or to a discount from the Price in the event that it does not use the ordered Service, in particular due to technical obstacles on its side and/or failure of its Participants to complete assessments.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">4. Information Security</h3>
                <h4 className="font-semibold mb-2">Confidentiality</h4>
                <p className="mb-3">
                    The Contracting Parties undertake to maintain confidentiality regarding all confidential information obtained in connection with the conclusion of the Agreement and the use of the Service. The obligation of confidentiality shall survive termination of the contractual relationship and shall not apply where disclosure of information is required by law.
                </p>

                <h4 className="font-semibold mb-2">Personal Data Protection</h4>
                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Roles of the Contracting Parties</h5>
                <p className="mb-2">
                    The Client acts as the data controller within the meaning of the GDPR, as it determines the purposes and means of processing the personal data of Participants. Behavera acts as the data processor and processes personal data exclusively on the basis of the Client’s instructions and to the extent necessary for the provision of the Behavera Service.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Subject Matter, Duration, and Purpose of Processing</h5>
                <p className="mb-2">
                    The subject matter of processing consists of the personal data of Participants involved by the Client in the use of the Service. Processing is carried out for the duration of the contractual relationship, or for the period necessary to settle rights and obligations following its termination. The purpose of processing is the provision of the Service, in particular the implementation of Pulse surveys, evaluation of Participants’ responses, and making outputs available to the Client.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Types of Personal Data and Data Subjects</h5>
                <p className="mb-2">
                    In particular, the following may be processed:
                </p>
                <ul className="list-disc pl-5 mb-2">
                    <li>limited identification and contact data,</li>
                    <li>Participants’ responses within the Service,</li>
                    <li>technical data related to the use of the Service.</li>
                </ul>
                <p className="mb-2">
                    Special categories of personal data under Article 9 GDPR are not processed unless expressly agreed otherwise. The data subjects are Participants, i.e. natural persons involved by the Client in the Service.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Obligations of the Processor</h5>
                <p className="mb-2">
                    Behavera undertakes to:
                </p>
                <ul className="list-disc pl-5 mb-2">
                    <li>a) process personal data only on the basis of documented instructions from the Client,</li>
                    <li>b) ensure confidentiality of persons authorized to process the data,</li>
                    <li>c) implement appropriate technical and organizational measures pursuant to Article 32 GDPR,</li>
                    <li>d) provide reasonable assistance to the Client in fulfilling GDPR obligations,</li>
                    <li>e) notify the Client without undue delay of any personal data breach.</li>
                </ul>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Sub-processors</h5>
                <p className="mb-2">
                    The Client grants Behavera general authorization to engage additional processors, in particular providers of technical and cloud infrastructure.
                    Behavera shall ensure that such sub-processors are bound by obligations corresponding to this provision.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Termination of Processing</h5>
                <p className="mb-2">
                    Upon termination of the provision of the Service, Behavera shall delete or return the personal data in accordance with the Client’s instructions, unless retention is required by law.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">Liability</h5>
                <p className="mb-2">
                    The Client is responsible for fulfilling the obligations of a data controller, in particular for having a lawful basis for processing and for complying with information obligations towards data subjects.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">5. Intellectual Property Protection</h3>
                <p className="mb-3">
                    All content, functionalities, and technical solutions of the Service, including methodologies, tools, survey questions, algorithms, databases, user interfaces, and other related elements, are protected by intellectual property laws. The rights to these elements belong to Behavera or its licensing partners.
                </p>
                <p className="mb-3">
                    For the duration of the contractual relationship, the Client is entitled to use the Service exclusively by remote access and solely for its internal purposes, in accordance with these Terms. Provision of the Service does not result in any transfer of intellectual property rights to the Client.
                </p>
                <p className="mb-3">
                    In particular, the Client undertakes not to:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>make the Service or any part thereof available to unauthorized third parties,</li>
                    <li>make copies of the Service or its content,</li>
                    <li>perform reverse engineering, decompilation, or other interference with the technical solution of the Service,</li>
                    <li>use the Service for the purpose of developing or operating a competing solution.</li>
                </ul>
                <p>
                    This shall not affect the Client’s right to use outputs and results generated through the use of the Service for its internal purposes.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">6. Term of the Agreement and Its Termination</h3>
                <h4 className="font-semibold mb-2">Term of the Agreement</h4>
                <p className="mb-3">
                    The contractual relationship between Behavera and the Client is concluded for an indefinite period, unless expressly agreed otherwise between the Parties. The selected subscription variant (monthly or annual) determines the billing method and payment period, not the duration of the Agreement.
                </p>

                <h4 className="font-semibold mb-2">Termination of the Agreement by the Client</h4>
                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">a) Monthly Subscription</h5>
                <p className="mb-3">
                    In the case of a monthly subscription, the Client is entitled to terminate the Agreement in writing under the following conditions:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>during the first three (3) months from the commencement of the provision of the Service, the Client may terminate the Agreement at any time with immediate effect; the notice of termination must be delivered to Behavera no later than the last day of this period;</li>
                    <li>after the expiry of this three-month period, the Client is entitled to terminate the Agreement with a notice period of two (2) months, with the notice period commencing on the first day of the calendar month following the month in which the notice of termination is delivered to Behavera.</li>
                </ul>
                <p className="mb-3">
                    Termination of the Agreement shall not affect the Client’s obligation to pay the Price for periods already provided or paid for, unless expressly stated otherwise in these Terms.
                </p>

                <h5 className="font-semibold mb-1 text-sm text-brand-text-secondary">b) Annual Subscription</h5>
                <p className="mb-3">
                    In the case of an annual subscription, the Client is entitled to terminate the Agreement in writing provided that the notice of termination is delivered to Behavera no later than two (2) months prior to the expiry of the current twelve-month prepaid Service period.
                </p>
                <p className="mb-3">
                    If the notice of termination is not delivered within this period, the scope of the Service under the annual subscription shall be automatically renewed for a further twelve-month period (repeatedly).
                </p>

                <h4 className="font-semibold mb-2">Withdrawal from the Agreement by Behavera</h4>
                <p className="mb-3">
                    Behavera is entitled to withdraw from the Agreement with immediate effect if:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>a) the Client is in default with payment of any due amount for more than fourteen (14) calendar days, or</li>
                    <li>b) the Client materially breaches its obligations arising from the Agreement or these Terms, in particular obligations related to payments, proper and authorized use of the Service, or protection of Behavera’s rights.</li>
                </ul>

                <h4 className="font-semibold mb-2">Termination of the Agreement by Behavera Without Stating Reasons</h4>
                <p className="mb-3">
                    Behavera is entitled to terminate the Agreement in writing at any time without stating reasons, with a notice period of three (3) months. The notice period shall commence on the first day of the calendar month following the month in which the notice of termination is delivered to the Client.
                </p>
                <p className="mb-3">
                    In the event of termination under this provision, Behavera shall be obliged either to allow the Client to continue using the Service for a period corresponding to the already paid period, or to refund the Client a proportional part of the already paid Price for the period during which the Service will no longer be provided.
                </p>
                <p className="mb-3">
                    This shall not affect Behavera’s right to withdraw from the Agreement pursuant to the previous Article.
                </p>
                <p className="mb-3">
                    Behavera is entitled to terminate the Agreement under this provision even if the contractual relationship is agreed for a fixed term, unless expressly agreed otherwise between the Parties.
                </p>

                <h4 className="font-semibold mb-2">Consequences of Termination</h4>
                <p className="mb-3">
                    Termination of the Agreement for any reason shall not entitle the Client to a refund of payments already made or any proportional part thereof, except in cases expressly stated in these Terms.
                </p>
                <p>
                    Upon termination of the Agreement, the Client’s right to use the Service shall cease; this shall not affect obligations which by their nature are intended to survive termination of the Agreement, in particular obligations relating to confidentiality, intellectual property protection, and payment of outstanding amounts.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">7. Limitation of Liability and Disclaimer of Warranties</h3>
                <p className="mb-3">
                    The Service is provided as a cloud-based service on an “as is” and “as available” basis. Behavera provides no warranties regarding uninterrupted availability, error-free operation of the Service, or achievement of any specific results. Outputs, assessments, and recommendations generated through the Service are for informational purposes only and do not constitute professional advice; all decisions made on their basis are taken by the Client at its own responsibility.
                </p>
                <p>
                    To the maximum extent permitted by applicable law, Behavera’s total liability for damages arising in connection with the provision of the Service shall be limited to an amount corresponding to the Price of the Service paid by the Client for one (1) calendar month.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">8. Amendments to the Terms and the Price</h3>
                <p className="mb-3">
                    Behavera is entitled to unilaterally amend these Terms and/or the Price of the Service to a reasonable extent, in particular for the following reasons:
                </p>
                <ul className="list-disc pl-5 mb-3">
                    <li>a) changes in legal regulations, regulatory requirements, or interpretative practice of public authorities,</li>
                    <li>b) changes in technical, security, or operational parameters of the Service,</li>
                    <li>c) extension, limitation, modification, or optimization of Service functionalities or structure,</li>
                    <li>d) changes in costs of development, operation, maintenance, or support of the Service,</li>
                    <li>e) changes in Behavera’s business or pricing strategy,</li>
                    <li>f) adjustments of the Price reflecting market conditions, economic developments, or Behavera’s strategic objectives,</li>
                    <li>g) changes in the scope or manner of the Client’s use of the Service.</li>
                </ul>
                <p className="mb-3">
                    Any amendment to the Terms and/or the Price shall be notified to the Client at least thirty (30) days in advance by electronic mail sent to the Client’s contact email address and/or by notification in the Service’s user interface (e.g. notification or pop-up).
                </p>

                <h4 className="font-semibold mb-2">Client’s Right to Terminate the Agreement Upon Amendment</h4>
                <p className="mb-3">
                    If the Client does not agree with the amended Terms and/or the Price, it is entitled to terminate the Agreement in writing no later than on the date the amendment becomes effective. In such case, the contractual relationship shall terminate on the effective date of the amendment, unless agreed otherwise between the Parties.
                </p>
                <p className="mb-3">
                    If, as of the termination date, the Client has paid the Price for a period during which the Service will no longer be provided, Behavera shall refund the Client a proportional part of the paid Price corresponding to the unused part of the prepaid period.
                </p>

                <h4 className="font-semibold mb-2">Acceptance of Amendments</h4>
                <p className="mb-3">
                    If the Client continues to use the Service after the effective date of the amended Terms and/or Price, it shall be deemed that the Client accepts the amendment, and the amended Terms and/or Price shall become a binding part of the contractual relationship between the Client and Behavera.
                </p>

                <h4 className="font-semibold mb-2">Limitation of Effects of Amendments</h4>
                <p>
                    Unilateral amendments to the Terms and/or the Price shall not affect claims already due or performances provided prior to the effective date of the amendment, and rights of the Parties arising before that date shall remain unaffected.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold mb-3">9. Final Provisions</h3>
                <p className="mb-3">
                    These Terms and Conditions enter into force and effect on the 25th of January 2026.
                </p>
                <p className="mb-3">
                    These Terms and Conditions shall also apply to all contractual relationships between Behavera and Clients established prior to their effective date, as of the date on which the Client first logs into the Service or otherwise begins using it after the effective date.
                </p>
                <p>
                    In the event of any ambiguity, discrepancy, or dispute regarding the interpretation or meaning of these Terms and Conditions, the Czech language version shall prevail and be deemed the authoritative version. The current version of the Terms and Conditions of the Behavera Service in the Czech language is available at: <a href="https://cz.behavera.com/terms" className="text-brand-primary underline">cz.behavera.com/terms</a>.
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
