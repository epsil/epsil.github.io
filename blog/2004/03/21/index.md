---
title: Flash og tilgjengelighet
date: 2004-03-21
---

En nettside bør oppfylle tre krav:

-   Kravet til innhold
-   Kravet til brukervennlighet
-   Kravet til tilgjengelighet

Merk at «brukervennlighet» her også omfatter det estetiske aspektet ved siden; en pen og funksjonell side fungerer rett og slett mye bedre (og er mer tiltalende eller *vennlig*) enn en stygg og funksjonell side. (For mer om denne siden av saken, vil jeg anbefale Donald Normans klassiker [*The Design of Everyday Things*](http://vgrd.dk/arkiv/000158.php).) Vær også oppmerksom på at innhold og formidling er to fullstendig atskilte begreper. En god artikkel kan befinne seg på et nettsted med en forferdelig utforming, og en pen nettside kan være totalt blottet for informasjon som kommer den besøkende til gode (og som får vedkommende til å «bokmerke» siden).

Tilgjengelighet angir hvor mange som er i stand til å besøke nettstedet -- om det kan ses med høyest mulig antall nettlesere, i høyest mulig antall forskjellige oppløsninger og på forskjellige plattformer, og så videre. Dette er noe som tas hånd om i både HTML- og CSS-standardene, ved at informasjonen kan gjenbrukes ved å bruke strukturbasert kode, at tilleggsinformasjon kan legges ved for dem som ikke er i stand til å oppfatte hele siden på en gang, og ved at presentasjonsregler for flere medier kan angis (blant annet for talenettlesere). Merk at HTML og CSS er fullstendig *åpne* (og til dels «standardiserte») formater. Hvem som helst kan benytte seg av disse formatene uten å investere i ekstra programvare, og hvem som helst kan skrive programvare for produksjon, bearbeiding eller utveksling av data lagret i dem. Dette er selve nøkkelen til fri og uhemmet utveksling av informasjon.

Så hvordan kommer Flash inn i denne sammenhengen? Her velger jeg å definere Flash som et *interaktivt format for animering av vektor- eller matrisebaserte figurer.* Det er ikke noe i denne definisjonen som tyder på at Flash er særlig egnet til å formidle tekstlig informasjon via en allmenn informasjonstjeneste som WWW. For å illustrere dette vil jeg nå nevne noen ulemper slik bruk av formatet medfører i praksis. Enkelte av de følgende punktene overlapper hverandre, og det meste av dette er ikke relevant dersom man bare ønsker å *tjene penger;* her tar jeg bare stilling til hvordan Flash-baserte nettsider (ikke) oppfyller kravet til *tilgjengelighet* (beskrevet over).

Let's begin:

-   **Flash er et lukket format.** Dette er hovedproblemet med Flash, og de videre ulempene jeg nevner i dette innlegget henger i stor grad sammen med dette. Skal du *lage* noe i Flash, trenger du kommersiell programvare fra Macromedia. Skal du *se* Flash, trenger du også programvare fra Macromedia. Det er bare Macromedia som vet hvordan Flash faktisk fungerer, og du har dermed ingen garanti for at Flash-filene dine vil fungere også på fremtidens plattformer.
-   **Flash-sider fungerer ikke dersom du ikke har Flash.** Dette høres kanskje ut som et absurd argument, men det er faktisk dette som er kjernen i skillet mellom innhold og presentasjon. Du trenger ikke en nettleser med CSS-støtte for å lese en (strukturbasert) nettside som gjør bruk av CSS; informasjonen er fortsatt tilgjengelig, strukturert og fin.
-   **Flash er et mediespesifikt format.** Per dags dato *krever* Flash-nettsider at du har en grafisk nettleser; som oftest er det også helt nødvendig at du har et forhåndsbestemt skjermareal til disposisjon (de fleste Flash-sider er ikke skalerbare). Flash-sider vil altså ikke fungere i *f.eks.* tekstnettlesere, talenettlesere eller nettlesere med begrenset visningsareal (f.eks. på mobiltelefoner). Problemet er igjen det ikke-eksisterende skillet mellom innhold og presentasjon. (Dette *kan* endre seg med «[Section 508](http://www.section508.gov/)», men det gjenstår å se om ikke Macromedia er for sent ute.)
-   **Flash fungerer ikke på alle plattformer.** Som nevnt er det bare Macromedia som utvikler programvare for Flash, og derfor er det også Macromedia som bestemmer hvem som kan se Flash (og benytte seg av Flash-baserte nettsider). Flash-nettsider er ubrukelige i nettlesere det ikke eksisterer Flash-støtte for; i og med at antallet populære nettlesere og plattformer øker, er dette et stadig voksende problem. (I tillegg har jeg hatt problemer med at Flash-sider *krasjer* på eldre datamaskiner.)
-   **Søkemotorer leser ikke Flash.** Dette henger sammen med forrige punkt, og er kanskje den største grunnen til at Flash bør unngås som et tekstformat. Det er i dag umulig å indeksere og finne tilbake til informasjon i Flash-sider, noe som gjør innholdet usynlig i «den store sammenhengen».
-   **Ikke alle liker Flash.** Her tenker jeg ikke på utformingen til Flash-sider, men de nye mengder ekstra forstyrrende nettreklame Flash-formatet har påført oss. Som følge av dette velger mange å [slå av Flash](http://www.virtuelvis.com/archives/117.html). (Dette hadde ikke vært noe problem dersom innhold og presentasjon var separert også i Flash.)
-   **Flash er et binært format.** I motsetning til et HTML-dokument går ofte hele Flash-fila tapt dersom en byte eller to kommer på avveie. HTML, som er et tekstformat, kan leses av mennesker og er som regel lett å rette opp i; binærformater krever egne verktøy, og det er bare Macromedia som kan utvikle dette. Dette gjør Flash uegnet som et *varig lagringsformat* (gjelder for øvrig de fleste lukkede formater).
-   **Det er vanskelig å ta i bruk Flash uten å bryte andre nettstandarder.** Det som kjennetegner en god standard er at den er kompatibel med andre standarder eller formater. Det er i HTML-spesifikasjonen beskrevet en generell mekanisme for integrering av multimediaobjekter på nettsider, men denne støttes ikke av alle nettlesere. ([A List Apart](http://www.alistapart.com/) har beskrevet en [tungvint omvei](http://www.alistapart.com/articles/flashsatay/) som virker i alle nettlesere; imidlertid neppe noe som er tatt i bruk på de aller fleste sider som baserer seg på Flash.)

Blir da konklusjonen at Flash er en fullstendig verdiløs oppfinnelse? Ikke i utgangspunktet. Flash er tross alt et fremragende format for vektorbaserte figurer og animering, og tar liten plass. Det kunne med andre ord ha fungert perfekt til *illustrasjoner* på f.eks. (HTML-baserte) nettsider. Macromedias pengehunger har imidlertid villet det annerledes, og prøvd å forvandle formatet til noe det ikke har forutsetninger for å være.

<!--
Det fungerer fortsatt godt til kommersielle formål, men har begrenset verdi på en i utgangspunktet ikke-kommersiell informasjonstjeneste som WWW.

Jeg vil forresten påpeke at ingen her er i stand til å *kreve* hvordan en nettside skal være. Internett er fullstendig anarki, og man er stort sett fri til å gjøre hva man vil. Det er imidlertid allmenn enighet om at enkelte kjøreregler er det eneste som kan fungere i lengden (og for alle).
-->
