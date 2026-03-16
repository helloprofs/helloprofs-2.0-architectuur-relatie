"use client";

import { useState } from "react";
import { 
  User, 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Building2,
  Briefcase,
  Scale,
  CreditCard,
  Target,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  AlertTriangle,
  Package,
  Wrench,
  Shirt,
  Users,
  Coins,
  Wallet,
  Layers,
  FileText,
  ClipboardCheck,
  Megaphone,
  GraduationCap,
  TrendingUp
} from "lucide-react";















import { cn } from "@/lib/utils";

type Phase = {
  id: number;
  title: string;
  description: string;
  icon: any;
  questionRange: [number, number]; // [start index, end index] 1-based
};

const phases: Phase[] = [
  { id: 1, title: "De Opdracht", description: "Vraag 1-4", icon: Building2, questionRange: [1, 4] },
  { id: 2, title: "Bedrijfsvoering", description: "Vraag 5-8", icon: Wrench, questionRange: [5, 8] },
  { id: 3, title: "Financiën & Risico", description: "Vraag 9-13", icon: Coins, questionRange: [9, 13] },
  { id: 4, title: "Strategie & Toekomst", description: "Vraag 14-17", icon: Target, questionRange: [14, 17] },
];














export default function VendorProfilePage() {
  const [activeTab, setActiveTab] = useState<'settings' | 'legal'>('legal');
  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const questions = [
    {
      id: "nature_of_work",
      stepId: 1,
      label: "WAT IS DE AARD VAN JOUW WERKZAAMHEDEN EN INZET BINNEN DEZE OPDRACHT?",
      options: [
        "Ik werk als specialist met eigen expertise en regie.",
        "Ik word ingezet als flexibele kracht bij drukte.",
        "Mijn inzet varieert tussen specialistisch en flexibel werk.",
        "Mijn rol binnen deze opdracht is mij nog onduidelijk."
      ],
      explanation: "Deze vraag is belangrijk omdat hij laat zien of je echt als zelfstandige werkt, of eigenlijk gewoon meedraait als een gewone werknemer. Als je zegt dat je werkt als specialist met eigen regie, dan spreekt dat van ondernemerschap. In recente uitspraken van de rechtbanken in Rotterdam werd bepaald dat iemand die met eigen kennis en vrijheid werkt aan een duidelijk doel, vaker als zelfstandig ondernemer wordt gezien. Bij een andere zaak uit Oost-Brabant bleek juist dat bij structureel invallen bij drukte, zonder vervanging en met weinig vrijheid, de rechter sneller beoordeelt dat sprake is van loondienst. Het antwoord op deze vraag is niet allesbepalend, maar wel een belangrijk signaal in het totaalplaatje."
    },
    {
      id: "autonomy_how_when",
      stepId: 2,
      label: "IN HOEVERRE BEPAAL JIJ BIJ DEZE OPDRACHT ZELF HOE EN WANNEER JE WERKT?",
      options: [
        "Volledig zelfstandig: Ik bepaal alles zonder opdrachtgeverstoezicht.",
        "Grotendeels zelfstandig: Ik bepaal zelf, maar volg enkele afspraken.",
        "Beperkt zelfstandig: Opdrachtgever bepaalt deels mijn planning en werkwijze.",
        "Geen zelfstandigheid: Opdrachtgever bepaalt mijn planning en uitvoering."
      ],
      explanation: "Deze vraag is belangrijk omdat het de gezagsverhouding beter inzichtelijk maakt. Het gaat hier niet om wát je doet, maar om hóe en wanneer dat gebeurt. Wie daarover beslist. Bij zelfstandige ondernemers ligt die regie meestal volledig bij henzelf. In een recente zaak in Rotterdam werd beoordeeld dat een zzp’er die zijn eigen werktijden en werkplek bepaalde, géén werknemer was. Daarentegenover staat een uitspraak uit Amsterdam waarin vaste werktijden, strakke deadlines en controle vanuit de eindredactie wél leidden tot de conclusie dat sprake was van een arbeidsovereenkomst. Als je dus weinig invloed hebt op je planning en werkwijze, is het risico op een gezagsverhouding groter. Het antwoord op deze vraag is een belangrijk signaal bij de beoordeling van de samenwerking door de Belastingdienst."
    },
    {
      id: "fixed_duration",
      stepId: 3,
      label: "HEEFT DEZE OPDRACHT EEN VAST BEGIN EN EINDE?",
      options: [
        "Ja, deze opdracht is tijdelijk en heeft een einddatum.",
        "Nee, deze opdracht is structureel en doorlopend werk."
      ],
      explanation: "Een duidelijke opdrachtduur helpt bepalen of sprake is van een structurele samenwerking. Gaat het om een eenmalige klus of om werk zonder eindpunt? Bij zelfstandig ondernemers zie je meestal dat opdrachten tijdelijk, afgebakend en resultaatgericht zijn. In een zaak bij het gerechtshof Amsterdam werd juist het ontbreken van een einddatum gezien als aanwijzing voor structurele werk en daarmee een arbeidsovereenkomst. Daarentegenover staat een uitspraak in Limburg waarbij het projectmatige karakter, de vrijheid van planning en het feit dat de opdracht tijdelijk was, juist bijdroegen aan de conclusie dat sprake was van zelfstandig ondernemerschap. De Belastingdienst kijkt naar dit soort signalen als onderdeel van het bredere beeld: hoe langer en vager de opdracht, hoe groter het risico dat het op een dienstverband lijkt."
    },
    {
      id: "error_responsibility",
      stepId: 4,
      label: "IN HOEVERRE BEN JE VERANTWOORDELIJK BIJ FOUTEN IN DE OPDRACHT?",
      options: [
        "Volledig verantwoordelijk: Ik draag alle gevolgen bij fouten.",
        "Gedeeltelijk verantwoordelijk: Ik draag deels verantwoordelijkheid",
        "Geen verantwoordelijkheid: Opdrachtgever draagt alle verantwoordelijkheid."
      ],
      explanation: "Het dragen van verantwoordelijkheid bij fouten laat een verschil zien tussen ondernemerschap en werknemerschap. In Oost-Brabant¹ werd het zelfstandig karakter van de samenwerking bevestigd doordat de zzp’er zelf opdraaide voor fouten. In Midden-Nederland² leidde onduidelijkheid over aansprakelijkheid tot twijfel over zijn zelfstandigheid. In Rotterdam³ werden fouten helemaal niet aan de uitvoerders toegerekend, dit was juist een indicatie voor een bestaan van een arbeidsovereenkomst. Of iemand risico’s loopt bij fouten zegt veel over de werkelijkheid van de samenwerking en is daarom belangrijk in de beoordeling van schijnzelfstandigheid."
    },
    {
      id: "materials_purchase",
      stepId: 5,
      label: "HOE REGEL JE DE INKOOP EN HET GEBRUIK VAN MATERIALEN?",
      options: [
        "Volledig eigen beheer: Ik koop en betaal alle materialen.",
        "Gedeeltelijk eigen beheer: Ik gebruik zowel eigen als materialen van opdrachtgever.",
        "Alleen via opdrachtgever: Alle materialen worden aangeleverd door opdrachtgever.",
        "Niet van toepassing: Mijn werk vereist geen materialen."
      ],
      explanation: "Deze vraag is belangrijk omdat het laat zien hoe zelfstandig een zzp’er echt werkt. Een ondernemer kiest en koopt zijn eigen materialen. Als alle verbruiksmiddelen (zoals stoffen, kleinmateriaal of andere spullen) door de opdrachtgever worden geleverd of betaald, is dat vaak een teken van afhankelijkheid. In een naaiatelier in Den Haag¹ vond de rechter dat er sprake was van een dienstverband, juist omdat de opdrachtgever alles regelde. Bij Tata Steel² versterkte het feit dat de zzp’er alleen werkte met materialen van de opdrachtgever het beeld van een werknemer. Maar in een bouwzaak in Brabant³, waar de opdrachtgever óók het hout leverde, oordeelde de rechter toch dat er géén sprake was van een arbeidsovereenkomst. Dat kwam doordat de timmerlieden verder volledig zelfstandig werkten en risico’s droegen. Het antwoord op deze vraag is dus niet doorslaggevend, maar wel een belangrijk signaal."
    },
    {
      id: "business_assets",
      stepId: 6,
      label: "GEBRUIK JE VOOR DEZE OPDRACHT JE EIGEN GEREEDSCHAPPEN, VERVOERSMIDDELEN EN APPARATUUR?",
      options: [
        "Ja, ik werk alleen met mijn eigen bedrijfsmiddelen.",
        "Gedeeltelijk: Ik gebruik zowel eigen bedrijfsmiddelen als die van opdrachtgever.",
        "Nee, ik werk volledig met bedrijfsmiddelen van de opdrachtgever.",
        "Nog niet, maar ik wil binnenkort investeren.",
        "Niet van toepassing: Mijn werk vereist geen eigen bedrijfsmiddelen."
      ],
      explanation: "Het gebruik van bedrijfsmiddelen – zoals voertuigen, machines of apparatuur – raakt direct aan de mate van zelfstandigheid. Wie over het materieel beschikt, bepaalt vaak ook hoe en wanneer het werk wordt uitgevoerd. In West-Brabant¹ werd een chauffeur die werkte met een bus van de opdrachtgever en geen eigen toegang had tot het pand, aangemerkt als werknemer. Daarentegen oordeelde de rechter in Rotterdam² dat een zzp’er die met een gefinancierde maar doorbelaste auto werkte, tóch zelfstandig was – mede vanwege zijn rol als consultant en eigen contractvorming. In een derde zaak uit West-Brabant³ werd zelfs met gebruik van machines van de opdrachtgever geen arbeidsovereenkomst aangenomen, omdat alle omstandigheden meewegend het gedrag meer leek op dat van een opdrachtgever en ondernemer."
    },
    {
      id: "work_clothing",
      stepId: 7,
      label: "HOE REGEL JE JOUW BEDRIJFSKLEDING VOOR DEZE OPDRACHT?",
      options: [
        "Ik regel het volledig zelf en betaal alles.",
        "Opdrachtgever regelt bedrijfskleding en factureert aan mij.",
        "Gedeeltelijk zelf: Ik gebruik eigen kleding, de opdrachtgever geeft soms aanvullende items als hesjes of veiligheidskleding.",
        "Opdrachtgever vergoedt mijn bedrijfskleding volledig.",
        "Niet van toepassing: Mijn werk vereist geen bedrijfskleding."
      ],
      explanation: "Deze vraag is belangrijk omdat het dragen van bedrijfskleding een sterk signaal kan zijn van organisatorische inbedding. Het gaat er niet alleen om wie de kleding betaalt, maar of de zzp’er visueel wordt opgenomen in de structuur van de organisatie. In een zaak uit Zeeland-West-Brabant¹ droeg de zzp’er exact dezelfde kleding als vaste medewerkers en werd dat meegewogen als bewijs van integratie. In een vergelijkbare zaak² werd benadrukt dat uniformiteit voor de buitenwereld een teken was dat geen onderscheid bestond tussen loondienst en opdrachtnemer. Ook in een zaak binnen de zorg³ droeg de zzp’er identiek tenue met logo, waardoor het onderscheid tussen zelfstandig en intern personeel vervaagde."
    },
    {
      id: "activity_participation",
      stepId: 8,
      label: "NEEM JE DEEL AAN NIET-OPDRACHT GERELATEERDE ACTIVITEITEN BIJ DEZE OPDRACHTGEVER?",
      options: [
        "Nee, ik neem niet deel aan deze activiteiten.",
        "Soms, alleen als dit functioneel noodzakelijk is.",
        "Ja, ik neem regelmatig deel aan zulke activiteiten."
      ],
      explanation: "Deze vraag is belangrijk omdat structurele deelname aan sociale en organisatorische activiteiten van de opdrachtgever kan wijzen op inbedding en daarmee op een gezagsverhouding. In een zaak over een cameravrouw bij een publieke omroep werd het organiseren van bedrijfsuitjes en deelname aan interne communicatie wél als signaal van schijnzelfstandigheid meegewogen, maar dit woog onvoldoende zwaar om te concluderen dat sprake was van een arbeidsovereenkomst¹. In een andere zaak met buitenlandse timmerlieden werd hun afwezigheid bij personeelsactiviteiten, trainingen en functioneringsgesprekken expliciet genoemd als argument vóór zelfstandig ondernemerschap². Ook bij een servicemedewerker telde het ontbreken van toegang tot interne regelingen en kantoorstructuren mee in het oordeel dat geen sprake was van een arbeidsovereenkomst en inbedding³."
    },
    {
      id: "btw_charging",
      stepId: 9,
      label: "HOE FACTUREER JE DE BTW VOOR DEZE OPDRACHT?",
      options: [
        "Ik factureer met 21% of 9% BTW.",
        "Ik factureer zonder BTW (0%, verlegd of vrijgesteld)."
      ],
      explanation: "Deze vraag is toegevoegd omdat het inzicht geeft in hoe de opdrachtnemer zich fiscaal en economisch opstelt. Zelfstandig factureren mét BTW wijst erop dat iemand bewust als ondernemer opereert en zijn diensten aanbiedt in het economisch verkeer. In een Limburgse zaak¹ werd dit gezien als een krachtig signaal van ondernemerschap, zeker in combinatie met meerdere opdrachtgevers en vrije tariefbepaling. In een andere zaak in Rotterdam² werd het factureren met BTW wel erkend, maar woog het minder zwaar omdat de tarieven niet onderhandelbaar waren en de feitelijke werksituatie dat beeld ondergroef. En in Den Haag³ werd duidelijk dat het hanteren van BTW zijn waarde verliest als er via een verloningsconstructie alsnog loon wordt uitbetaald. Het antwoord op deze vraag zegt dus niet alles, maar is zeker van belang: als het past binnen een bredere context van ondernemend gedrag, versterkt het de zelfstandige status."
    },
    {
      id: "payment_risk",
      stepId: 10,
      label: "HOE GA JE OM MET HET RISICO DAT EEN OPDRACHTGEVER NIET BETAALT?",
      options: [
        "Ik loop volledig risico en moet zelf achter mijn geld aan.",
        "Ik beperk risico, bijvoorbeeld met boeterente, incassobeleid of factoring. Maar loop nog risico.",
        "Ik werk alleen met vooruitbetaling of een gegarandeerde betaling."
      ],
      explanation: "Deze vraag is belangrijk omdat zij inzicht geeft in het financieel risico dat de opdrachtnemer draagt. Het gaat hier niet om de hoogte van de betaling, maar om de zekerheid ervan. Een werknemer heeft recht op loondoorbetaling, een ondernemer moet zelf achter zijn geld aan. In een recente zaak in Rotterdam¹ werd geoordeeld dat een consultant zonder betalingsgaranties écht ondernemersrisico liep. Daarentegenover staat een uitspraak uit Limburg² waarin een cameravrouw zelf verantwoordelijk was voor facturatie en verzekering. Ook in Oost-Brabant³ gold: wie accepteert dat betaling niet gegarandeerd is, toont zelfstandig ondernemerschap."
    },
    {
      id: "number_of_clients",
      stepId: 11,
      label: "VOOR HOEVEEL VERSCHILLENDE OPDRACHTGEVERS WERK JE MOMENTEEL ALS ZELFSTANDIGE?",
      options: [
        "1 opdrachtgever: Ik werk voor één opdrachtgever.",
        "2-3 opdrachtgevers: Ik spreid mijn inkomsten en opdrachten.",
        "4+ opdrachtgevers: Ik ben minder afhankelijk van één klant."
      ],
      explanation: "Deze vraag is belangrijk omdat het aantal opdrachtgevers iets zegt over de onafhankelijkheid van de zzp’er op dit moment. Werkt iemand langere tijd alleen voor één opdrachtgever, dan kan dat erop wijzen dat er toch sprake is van een verkapt dienstverband. In een recente uitspraak uit Oost-Brabant¹ bleek dat iemand tóch als zelfstandig werd gezien, ondanks dat hij tijdelijk maar één opdrachtgever had — omdat hij op andere punten duidelijk als ondernemer opereerde. In een andere zaak² werd juist het feit dat iemand meerdere opdrachtgevers had meegenomen als bewijs dat hij echt zelfstandig werkte. De rechters benadrukken telkens dat het niet om één signaal gaat, maar om het totaalplaatje.³"
    },
    {
      id: "insurance_choice",
      stepId: 12,
      label: "HEB JE BEWUST GEKOZEN WELKE VERZEKERINGEN JE AFSLUIT EN WELKE RISICO'S JE ZELF DRAAGT?",
      options: [
        "Ja, ik heb verzekeringen en neem zelf risico's voor onverzekerde zaken.",
        "Ja, ik ben bezig met keuzes en begrijp de financiële risico's.",
        "Nee, ik heb geen verzekeringen en accepteer alle ondernemersrisico's zelf."
      ],
      explanation: "Het afsluiten van verzekeringen wijst op het dragen van ondernemersrisico. Zelfstandig ondernemers nemen zélf verantwoordelijkheid voor schade, aansprakelijkheid of ziekte. Rechters beschouwen het hebben van een beroeps- of aansprakelijkheidsverzekering dan ook als sterk signaal van ondernemerschap. In Rotterdam¹ en Oost-Brabant² werd expliciet benoemd dat de opdrachtnemer een verzekering had afgesloten, wat meewoog in het oordeel dat géén arbeidsovereenkomst bestond. Ook in een andere zaak in Rotterdam³ werd een afgesloten verzekering als bewijs van commercieel risico gezien. Het antwoord op deze vraag toont dus of iemand écht zelfstandig onderneemt of vooral op zekerheden vertrouwt die passen bij een loondienstrelatie.\n\nWist je dat je met helloprofs.nl heel makkelijk een verzekering hebt afgesloten voor jouw werkzaamheden? Kijk daarvoor op https://helloprofs.nl/zzp-verzekeringen/"
    },
    {
      id: "general_terms",
      stepId: 13,
      label: "HEB JE ALGEMENE VOORWAARDEN DIE JOUW RECHTEN EN VERPLICHTINGEN VASTLEGGEN?",
      options: [
        "Ja, ik hanteer eigen algemene voorwaarden bij opdrachten en voeg deze zelf als bijlage bij de offerte toe.",
        "Ja, ik gebruik de voorwaarden die helloprofs.nl voor mij heeft opgesteld.",
        "Nee, ik hanteer geen algemene voorwaarden"
      ],
      explanation: "Deze vraag is belangrijk omdat eigen algemene voorwaarden een sterk signaal zijn van zelfstandig ondernemerschap. Ze geven aan dat de zzp’er zelf ook regie voert over risicoverdeling, aansprakelijkheid en betalingsvoorwaarden — allemaal zaken die juist níet worden geregeld bij werknemers. Rechters hechten daar waarde aan: in Limburg¹ en Amsterdam³ werden zzp’ers als zelfstandig beschouwd mede doordat zij hun eigen voorwaarden hanteerden. Ook wanneer afspraken schriftelijk goed zijn vastgelegd, telt dit mee bij de beoordeling van het gezagscriterium.² Wie dus geen eigen voorwaarden gebruikt, loopt meer risico dat een rechter de samenwerking als loondienst ziet."
    },
    {
      id: "tax_obligations",
      stepId: 14,
      label: "VOLDOE JE AAN ALLE FISCALE VERPLICHTINGEN ALS ZELFSTANDIG ONDERNEMER?",
      options: [
        "Ja, mijn administratie is volledig op orde.",
        "Gedeeltelijk, ik voldoe deels maar moet verbeteren.",
        "Nee, ik voldoe niet en werk eraan."
      ],
      explanation: "Deze vraag is belangrijk omdat correcte fiscale naleving essentieel is voor de kwalificatie als zelfstandig ondernemer. In de zaak bij de rechtbank Oost-Brabant¹ koppelde de rechter expliciet de fiscale realiteit – zoals het feit dat de zzp’er factureerde voor consultancy services, geen loonbelasting werd ingehouden, en zijn jaarcijfers deelde – aan zijn positie als ondernemer. Het was voor de rechter doorslaggevend dat hij dit niet alleen administratief zo had ingericht, maar zich ook zó opstelde in de onderhandeling en uitvoering. Dat gedrag bevestigde zijn keuze voor ondernemerschap. In de zaak in Rotterdam² werd die lijn doorgetrokken: ook daar werd belang gehecht aan het feit dat de zelfstandige bewust koos voor een constructie waarin hij zelf belastingafdracht regelde, factureerde via eigen vennootschappen en geen afhankelijkheid toonde. En bij de cameravrouw uit Limburg³ bleek onder meer uit het ontbreken van loondoorbetaling bij verlof en het zelfstandig dragen van ondernemersrisico’s dat sprake was van een reële ondernemerspraktijk. Het antwoord op deze vraag is dus méér dan een checkbox — het toont hoe serieus iemand zijn zelfstandigheid fiscaal en praktisch vormgeeft."
    },
    {
      id: "advertising_marketing",
      stepId: 15,
      label: "HOE ZORG JE ERVOOR DAT NIEUWE KLANTEN JOU KUNNEN VINDEN?",
      options: [
        "Ik investeer in reclame en promoot mijn bedrijf actief (bijvoorbeeld via helloprofs.nl)",
        "Ik doe soms promotie, maar investeer er niet in.",
        "Ik haal werk alleen uit mijn vaste klanten."
      ],
      explanation: "Deze vraag is belangrijk omdat zij inzicht geeft in het commerciële gedrag van een zzp’er: investeert hij actief in klantwerving of werkt hij vooral voor één opdrachtgever? Dat verschil is relevant voor de kwalificatie als ondernemer. In de Deliveroo-zaak¹ oordeelde het hof dat de bezorgers geen acquisitie deden en dat klanten via het platform kwamen — wat juist géén ondernemerschap toonde. Ook in de Haagse zorgzaak² woog mee dat de coördinator geen andere klanten had en zich had uitgeschreven als ondernemer. De Hoge Raad³ benadrukt dat actief op zoek gaan naar nieuwe klanten en het lopen van commercieel risico belangrijk zijn. Het antwoord op deze vraag helpt dus om echte zelfstandigheid van schijnzelfstandigheid te onderscheiden."
    },
    {
      id: "continuing_education",
      stepId: 16,
      label: "NEEM JE STAPPEN OM JOUW KENNIS EN VAARDIGHEDEN BIJ TE HOUDEN?",
      options: [
        "Ja, ik regel zelf mijn bijscholing en ontwikkeling.",
        "Ja, ik volg bijscholing via mijn opdrachtgever, maar ik betaal die zelf.",
        "Ja, dat wordt betaald door de opdrachtgever.",
        "Nee, ik volg momenteel geen bijscholing.",
        "Nee, maar ik ben bereid bijscholing te volgen."
      ],
      explanation: "Deze vraag is belangrijk omdat het laat zien wie er beslist over ontwikkeling en bijscholing. Als een opdrachtgever bepaalt dat iemand verplicht trainingen moet volgen, en die ook organiseert of betaalt, dan lijkt het meer op een gewone baan. In de zaak bij Microsoft¹ moest de zzp’er verplichte trainingen volgen onder toezicht — dat wees op een gezagsverhouding. In een andere zaak mocht de zzp’er zelf kiezen hoe, waar en wanneer hij werkte en zich ontwikkelde — daar was dus geen sprake van een arbeidsovereenkomst.² In een derde zaak volgde de zzp’er verplichte scholing en overlegmomenten samen met vaste medewerkers, en werd hij net als hen behandeld — ook dat wees op werknemerschap.³ Dus: wie beslist over bijscholing en hoe dat geregeld is, zegt veel over hoe zelfstandig iemand echt is."
    },
    {
      id: "business_continuity",
      stepId: 17,
      label: "HOE ZORG JE ERVOOR DAT JE ONDERNEMING OP DE LANGE TERMIJN BLIJFT BESTAAN?",
      options: [
        "Ik bouw een breed klantenbestand en investeer in groei.",
        "Ik zorg voor klanten, maar zonder vaste aanpak.",
        "Ik heb geen plan en ben afhankelijk van opdrachten."
      ],
      explanation: "Deze vraag gaat over hoe je je bedrijf opbouwt en in stand houdt. Een echte ondernemer denkt vooruit: hoe blijf ik zichtbaar, hoe kom ik aan klanten, hoe zorg ik dat mijn bedrijf blijft draaien? Niet alleen het aantal opdrachtgevers is relevant, maar ook of iemand een strategie heeft voor klantwerving, marktbewerking en risicobeheersing. In Rotterdam¹ werd geoordeeld dat een salesmanager, ondanks langdurige inzet bij één partij, zelfstandig opereerde omdat hij via eigen bv’s factureerde, risico’s droeg en bewust geen andere klanten zocht. In een andere zaak uit Rotterdam² bleek uit de feitelijke afhankelijkheid en werkinbedding juist dat er wél sprake was van een dienstverband. Ook in een derde uitspraak³ concludeerde de rechter dat het ontbreken van acquisitie en strategisch ondernemersgedrag leidde tot het aannemen van een een arbeidsovereenkomst."
    }
  ];













  const calculateScore = () => {
    const totalQuestions = 17; // We target 17 total questions
    let scoredPoints = 0;
    
    // nature_of_work scoring
    if (answers.nature_of_work === "Ik werk als specialist met eigen expertise en regie.") scoredPoints += 1;
    if (answers.nature_of_work === "Mijn inzet varieert tussen specialistisch en flexibel werk.") scoredPoints += 0.5;

    // autonomy_how_when scoring
    if (answers.autonomy_how_when === "Volledig zelfstandig: Ik bepaal alles zonder opdrachtgeverstoezicht.") scoredPoints += 1;
    if (answers.autonomy_how_when === "Grotendeels zelfstandig: Ik bepaal zelf, maar volg enkele afspraken.") scoredPoints += 0.7;
    if (answers.autonomy_how_when === "Beperkt zelfstandig: Opdrachtgever bepaalt deels mijn planning en werkwijze.") scoredPoints += 0.3;

    // fixed_duration scoring
    if (answers.fixed_duration === "Ja, deze opdracht is tijdelijk en heeft een einddatum.") scoredPoints += 1;

    // error_responsibility scoring
    if (answers.error_responsibility === "Volledig verantwoordelijk: Ik draag alle gevolgen bij fouten.") scoredPoints += 1;
    if (answers.error_responsibility === "Gedeeltelijk verantwoordelijk: Ik draag deels verantwoordelijkheid") scoredPoints += 0.5;

    // materials_purchase scoring
    if (answers.materials_purchase === "Volledig eigen beheer: Ik koop en betaal alle materialen.") scoredPoints += 1;
    if (answers.materials_purchase === "Gedeeltelijk eigen beheer: Ik gebruik zowel eigen als materialen van opdrachtgever.") scoredPoints += 0.5;
    if (answers.materials_purchase === "Niet van toepassing: Mijn werk vereist geen materialen.") scoredPoints += 1;

    // business_assets scoring
    if (answers.business_assets === "Ja, ik werk alleen met mijn eigen bedrijfsmiddelen.") scoredPoints += 1;
    if (answers.business_assets === "Gedeeltelijk: Ik gebruik zowel eigen bedrijfsmiddelen als die van opdrachtgever.") scoredPoints += 0.5;
    if (answers.business_assets === "Niet van toepassing: Mijn werk vereist geen eigen bedrijfsmiddelen.") scoredPoints += 1;

    // work_clothing scoring
    if (answers.work_clothing === "Ik regel het volledig zelf en betaal alles.") scoredPoints += 1;
    if (answers.work_clothing === "Opdrachtgever regelt bedrijfskleding en factureert aan mij.") scoredPoints += 0.7;
    if (answers.work_clothing === "Gedeeltelijk zelf: Ik gebruik eigen kleding, de opdrachtgever geeft soms aanvullende items als hesjes of veiligheidskleding.") scoredPoints += 0.5;
    if (answers.work_clothing === "Niet van toepassing: Mijn werk vereist geen bedrijfskleding.") scoredPoints += 1;

    // activity_participation scoring
    if (answers.activity_participation === "Nee, ik neem niet deel aan deze activiteiten.") scoredPoints += 1;
    if (answers.activity_participation === "Soms, alleen als dit functioneel noodzakelijk is.") scoredPoints += 0.5;

    // btw_charging scoring
    if (answers.btw_charging === "Ik factureer met 21% of 9% BTW.") scoredPoints += 1;

    // payment_risk scoring
    if (answers.payment_risk === "Ik loop volledig risico en moet zelf achter mijn geld aan.") scoredPoints += 1;
    if (answers.payment_risk === "Ik beperk risico, bijvoorbeeld met boeterente, incassobeleid of factoring. Maar loop nog risico.") scoredPoints += 0.7;

    // number_of_clients scoring
    if (answers.number_of_clients === "2-3 opdrachtgevers: Ik spreid mijn inkomsten en opdrachten.") scoredPoints += 0.7;
    if (answers.number_of_clients === "4+ opdrachtgevers: Ik ben minder afhankelijk van één klant.") scoredPoints += 1;

    // insurance_choice scoring
    if (answers.insurance_choice === "Ja, ik heb verzekeringen en neem zelf risico's voor onverzekerde zaken.") scoredPoints += 1;
    if (answers.insurance_choice === "Ja, ik ben bezig met keuzes en begrijp de financiële risico's.") scoredPoints += 0.5;
    if (answers.insurance_choice === "Nee, ik heb geen verzekeringen en accepteer alle ondernemersrisico's zelf.") scoredPoints += 1; // Accepting own risk is also entrepreneurial

    // general_terms scoring
    if (answers.general_terms === "Ja, ik hanteer eigen algemene voorwaarden bij opdrachten en voeg deze zelf als bijlage bij de offerte toe.") scoredPoints += 1;
    if (answers.general_terms === "Ja, ik gebruik de voorwaarden die helloprofs.nl voor mij heeft opgesteld.") scoredPoints += 0.7;

    // tax_obligations scoring
    if (answers.tax_obligations === "Ja, mijn administratie is volledig op orde.") scoredPoints += 1;
    if (answers.tax_obligations === "Gedeeltelijk, ik voldoe deels maar moet verbeteren.") scoredPoints += 0.5;

    // advertising_marketing scoring
    if (answers.advertising_marketing === "Ik investeer in reclame en promoot mijn bedrijf actief (bijvoorbeeld via helloprofs.nl)") scoredPoints += 1;
    if (answers.advertising_marketing === "Ik doe soms promotie, maar investeer er niet in.") scoredPoints += 0.5;

    // continuing_education scoring
    if (answers.continuing_education === "Ja, ik regel zelf mijn bijscholing en ontwikkeling.") scoredPoints += 1;
    if (answers.continuing_education === "Ja, ik volg bijscholing via mijn opdrachtgever, maar ik betaal die zelf.") scoredPoints += 0.8;

    // business_continuity scoring
    if (answers.business_continuity === "Ik bouw een breed klantenbestand en investeer in groei.") scoredPoints += 1;
    if (answers.business_continuity === "Ik zorg voor klanten, maar zonder vaste aanpak.") scoredPoints += 0.5;

    return Math.round((scoredPoints / totalQuestions) * 100);
  };













  const score = calculateScore();

  const getImprovements = () => {
    const list = [];
    if (answers.nature_of_work === "Ik word ingezet als flexibele kracht bij drukte.") {
      list.push("Probeer meer regie te voeren over de uitvoering van uw werkzaamheden om ondernemerschap te benadrukken.");
    }
    return list;
  };

  const improvements = getImprovements();

  const nextStep = () => {
    if (currentStep < 17) {
      // If we don't have the next step defined yet, we could show a placeholder or wait
      // But for now, we just increment or show result if it's the last implemented one
      if (currentStep < 17) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowResult(true);
      }
    } else {
      setShowResult(true);
    }
  };


  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mijn Profiel</h2>
          <p className="text-slate-500 mt-1">Beheer uw gegevens en fiscaal-juridisch profiel.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'settings' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700 cursor-pointer"
          )}
        >
          <User size={16} /> Accountinstellingen
        </button>
        <button 
          onClick={() => setActiveTab('legal')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all",
            activeTab === 'legal' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700 cursor-pointer"
          )}
        >
          <Shield size={16} /> Fiscaal-juridisch Profiel
        </button>
      </div>

      {activeTab === 'settings' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 animate-in fade-in duration-300">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h3 className="font-bold text-slate-900">Persoonsgegevens</h3>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Volledige Naam</label>
                    <input type="text" defaultValue="Marc de Vriend" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">E-mailadres</label>
                    <input type="email" defaultValue="marc@vriend-consultancy.nl" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                 </div>
              </div>
              <div className="space-y-4">
                 <h3 className="font-bold text-slate-900">Bedrijfsgegevens</h3>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">Bedrijfsnaam</label>
                    <input type="text" defaultValue="Vriend Consultancy B.V." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase">KVK Nummer</label>
                    <input type="text" defaultValue="12345678" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                 </div>
              </div>
           </div>
           <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                 Wijzigingen Opslaan
              </button>
           </div>
        </div>
      ) : showResult ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8 animate-in zoom-in-95 duration-300">
           <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle 
                      cx="64" cy="64" r="58" 
                      fill="transparent" 
                      stroke="#f1f5f9" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="64" cy="64" r="58" 
                      fill="transparent" 
                      stroke={score > 70 ? "#10b981" : score > 40 ? "#f59e0b" : "#ef4444"} 
                      strokeWidth="8" 
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * score) / 100}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">{score}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                 </div>
              </div>
              
              <div>
                 <h3 className="text-2xl font-bold text-slate-900">Uw Fiscaal-Juridisch Profiel</h3>
                 <p className="text-slate-500 mt-2">
                    Op basis van uw antwoorden is uw mate van zelfstandigheid berekend. 
                    {score > 70 
                      ? " Uw profiel wijst op een sterke mate van zelfstandigheid conform de Wet DBA." 
                      : " Er zijn enkele aandachtspunten om schijnzelfstandigheid te voorkomen."}
                 </p>
              </div>

              {improvements.length > 0 && (
                <div className="w-full text-left space-y-4 pt-4">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verbeterpunten</h4>
                   <div className="space-y-3">
                      {improvements.map((item, i) => (
                         <div key={i} className="flex gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl font-medium text-orange-900">
                            <Info size={18} className="text-orange-600 shrink-0" />
                            <p className="text-sm">{item}</p>
                         </div>
                      ))}
                   </div>
                </div>
              )}

              <div className="pt-8 flex gap-4 w-full">
                  <button 
                   onClick={() => { setShowResult(false); setCurrentStep(1); }}
                   className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                     Antwoorden aanpassen
                  </button>
                  <button className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                     Rapport Downloaden
                  </button>
               </div>
            </div>
         </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-x-auto">
            <div className="flex justify-between items-center min-w-[700px] gap-8 px-4">
              {phases.map((phase, idx) => {
                const isActive = currentStep >= phase.questionRange[0] && currentStep <= phase.questionRange[1];
                const isCompleted = currentStep > phase.questionRange[1];
                
                return (
                  <div key={phase.id} className="flex items-center flex-1 last:flex-none">
                    <button 
                      onClick={() => setCurrentStep(phase.questionRange[0])}
                      className="flex flex-col items-center gap-2 relative z-10 group cursor-pointer"
                    >
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                          isActive ? "bg-indigo-600 text-white scale-110 shadow-xl shadow-indigo-500/20" : 
                          isCompleted ? "bg-emerald-500 text-white" : 
                          "bg-slate-50 text-slate-300 border border-slate-100"
                        )}
                      >
                        {isCompleted ? <CheckCircle2 size={24} /> : <phase.icon size={24} />}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "text-[11px] font-bold uppercase tracking-wider transition-colors",
                          isActive ? "text-indigo-600" : "text-slate-400"
                        )}>
                          {phase.title}
                        </span>
                        <span className="text-[9px] font-medium text-slate-400">
                          {phase.description}
                        </span>
                      </div>
                    </button>
                    {idx < phases.length - 1 && (
                      <div className="flex-1 h-1 mx-4 bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white text-indigo-700 rounded-lg shadow-sm border border-slate-100">
                      {(() => {
                         const currentPhase = phases.find(p => currentStep >= p.questionRange[0] && currentStep <= p.questionRange[1]) || phases[0];
                         const Icon = currentPhase.icon;
                         return <Icon size={20} />;
                      })()}
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">
                        {(() => {
                          const currentPhase = phases.find(p => currentStep >= p.questionRange[0] && currentStep <= p.questionRange[1]) || phases[0];
                          return currentPhase.title;
                        })()}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold py-0.5 px-2 bg-indigo-50 text-indigo-700 rounded-full uppercase tracking-tight">
                           Vraag {currentStep} van 17
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {(() => {
                             const phase = phases.find(p => currentStep >= p.questionRange[0] && currentStep <= p.questionRange[1]) || phases[0];
                             const posInPhase = currentStep - phase.questionRange[0] + 1;
                             const totalInPhase = phase.questionRange[1] - phase.questionRange[0] + 1;
                             return `(${posInPhase} van ${totalInPhase} in deze fase)`;
                          })()}
                        </span>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                   {(() => {
                      const phase = phases.find(p => currentStep >= p.questionRange[0] && currentStep <= p.questionRange[1]) || phases[0];
                      const range = Array.from(
                        { length: phase.questionRange[1] - phase.questionRange[0] + 1 }, 
                        (_, i) => phase.questionRange[0] + i
                      );
                      
                      return range.map((qNum) => {
                        const isCurrent = qNum === currentStep;
                        const isDone = qNum < currentStep;
                        return (
                          <div 
                            key={qNum}
                            className={cn(
                              "relative flex items-center justify-center h-6 transition-all duration-500",
                              isCurrent ? "w-10" : "w-6"
                            )}
                          >
                            <div className={cn(
                               "absolute inset-0 rounded-full transition-all duration-500",
                               isCurrent ? "bg-indigo-600" : isDone ? "bg-emerald-500" : "bg-slate-200"
                            )} />
                            <span className={cn(
                              "relative z-10 text-[10px] font-black transition-colors duration-500",
                              isCurrent || isDone ? "text-white" : "text-slate-400"
                            )}>
                              {qNum}
                            </span>
                          </div>
                        );
                      });
                   })()}
                </div>
             </div>


             <div className="p-8 flex-1 space-y-8 overflow-y-auto">
                {questions
                  .filter(q => q.stepId === currentStep)
                  .map(q => (
                    <Question 
                      key={q.id}
                      id={q.id}
                      label={q.label}
                      options={q.options}
                      explanation={q.explanation}
                      value={answers[q.id]}
                      onChange={handleAnswer}
                    />
                  ))
                }
             </div>

             <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                   <ChevronLeft size={16} /> Vorige
                </button>
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                   {currentStep === 17 ? "Profiel Afronden" : "Volgende Vraag"} <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Question({ 
  label, 
  id, 
  value, 
  onChange, 
  options = ['Ja', 'Nee'],
  explanation
}: { 
  label: string, 
  id: string, 
  value?: string, 
  onChange: (id: string, val: string) => void,
  options?: string[],
  explanation?: string
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="space-y-4">
       <div className="flex flex-col gap-4">
          <p className="text-sm font-bold text-slate-800 uppercase tracking-tight leading-relaxed">{label}</p>
          
          <div className="grid grid-cols-1 gap-2">
             {options.map((option) => (
                <button
                   key={option}
                   onClick={() => onChange(id, option)}
                   className={cn(
                      "flex items-center gap-3 py-3.5 px-6 rounded-xl border text-sm font-medium transition-all text-left",
                      value === option 
                       ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/10" 
                       : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer"
                   )}
                >
                   <div className={cn(
                     "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                     value === option ? "bg-white/20 border-white" : "border-slate-200"
                   )}>
                     {value === option && <div className="w-2.5 h-2.5 bg-white rounded-[2px]" />}
                   </div>
                   {option}
                </button>
             ))}
          </div>
       </div>

       {explanation && (
         <div className="space-y-2">
            <button 
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest px-1"
            >
              <HelpCircle size={14} />
              {showExplanation ? "Verberg Uitleg" : "Toon Uitleg"}
              {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {showExplanation && (
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-bold text-rose-900 uppercase tracking-widest mb-2">Uitleg</p>
                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                  {explanation}
                </p>
              </div>
            )}
         </div>
       )}
    </div>
  );
}
