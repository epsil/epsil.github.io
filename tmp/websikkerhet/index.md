---
title: Websikkerhet
subtitle: Mer enn brannmur og kryptering
abstract: "Publisert i *Computerworld* nr. 47, juni 2001"
author: "Sverre H. Huseby"
author-url: "mailto:shh@thathost.com"
institute: "shh@thathost.com eller shh@heimdall.no"
date: 2001-06-12
emoji: false
autolink_bare_uris: false
indent: true
url: http://www.computerworld.no/cwi.nsf/Alle/5D86305CE1B6BD4AC1256A7300275537
stylesheet: /_assets/css/medium.css
references:
  "http://shh.thathost.com/text/websikkerhet-mer-enn-brannmur-og-kryptering.txt": .
  "SQL injection": .
---

Er du en av mange utviklere som tror at sikkerhet i en webløsning for det meste håndteres av en god brannmur, gode driftsrutiner og kryptert kommunikasjon? Det som gjerne kalles infrastruktursikkerhet? I så fall er jeg redd du begår en alvorlig feil.

Kjære utviklerkollega, tenk over følgende: En god brannmur stopper alle veier inn i datasystemet ditt *unntatt* veien gjennom løsningen du lager. Eksempel: Selv om brannmuren hindrer folk i å få direkte tilgang til databaseserveren, hindrer den ikke programmet ditt i å få tilgang. Selvsagt; hadde den gjort det, hadde jo ingenting virket. Problemet oppstår når noen klarer å lure programmet ditt til å sende egenkomponerte SQL-uttrykk til databasen. «Det er umulig,» har jeg fått høre av en del utviklere i det siste. Når jeg beviser det motsatte, er det en del som innser at det er noe de ikke vet.

SQL direkte til databasen er bare en av en lang rekke sikkerhetsfeil programmerere har lett for å introdusere i skreddersydde webapplikasjoner. Felles for alle feilene jeg konsentrerer meg om er at tradisjonelle sikkerhetsfirma typisk overser dem med sine automatiske scannere. Noen velplasserte tester *kan* gi indikasjoner på at noe er galt, men man kan ikke være sikker før man har gjennomgått kildekoden. Jeg velger å kalle dette for applikasjonssikkerhet. Applikasjonssikkerheten er utviklernes ansvar, mens infrastruktursikkerheten ivaretas av drifterne. Vi snakker om to ganske forskjellige verdener.

La oss nå kose oss litt med disse «umulige» SQL-uttrykkene, siden de gjerne åpner øynene til folk. Og munnene også, for den saks skyld; hakeslepp er ikke uvanlig. Spesielt blant folk som har laget en del webløsninger uten å kjenne til problemene.

Lureriet vi skal se på baserer seg på at utvikleren glemmer, eller oftere dropper å validere input fra verden der ute. En enkel test kan gi indikasjoner på om webløsninger er mottakelig for den slags. Testen kaller jeg «fnutt-testen». Det morsomme er at hvert tredje sted jeg tester har symptomene på en eller flere websider. Inkludert store aviser, offisielle statssider, nettbutikker av alle størrelser, tjenestesidene til ulike nettleverandører, og andre. Det som er enda morsommere, er at de færreste bryr seg om å svare på mine henvendelser, de lar like godt hullene forbli åpne. Weben er et stort sikkerhetshull som ligger i dvale.

Som første eksempel trekker jeg fram websidene til firmaet Svart Arbeid AS (for anledningen anonymisert), som tilbyr en handelsplass hvor medlemmer kan selge og kjøpe tjenester av hverandre. Medlemmene deles inn i flere kategorier, avhengig av hva de kan. Hvis jeg klikker på linken for «Frisører», tas jeg til følgende URL:

    http://svartarbeid.no/Kategori.asp?ID=1

Jeg får opp en liste med 15 navn. La meg nå se om denne webløsningen mangler vasking av inputdata, og dermed er mottakelig for det som kalles «data driven attacks». Jeg dytter inn en fnutt til slutt i URL-en, i håp om å provosere fram en feilmelding:

    http://svartarbeid.no/Kategori.asp?ID=1'

Aha! En trivelig liten melding fra ODBC-driveren inneholder blant annet følgende verdifulle informasjon:

    Incorrect syntax near 'SELECT ID, Title FROM Tree WHERE CatID=1'.

Fint. Nå vet jeg at inputdata sendes rett til databasen, at det er en tabell som heter `Tree`, og et felt som heter `CatID`. Feilmeldingen ga oss uvanlig mye hjelp, vi fikk jo se hele SQL-uttrykket som ble forsøkt kjørt i databasen. Vanligvis får man ikke fullt så mye informasjon, og i noen tilfeller får man ikke noen feilmelding i det hele tatt selv om feilen er til stede (typisk for applikasjoner med mer enn to lag).

Før jeg går videre, må jeg advare deg mot å teste disse tingene på websteder du ikke har utviklet selv. Jeg nøyer meg gjerne med å kjøre fnutt-testen og se om jeg får en feilmelding fra underliggende database. Eksperimentering utover det kan lett oppfattes som forsøk på innbrudd, noe som kan gi ubehagelige bivirkninger.

Utviklerne av svartarbeid.no nekter å godta at feilmeldingen indikerer at noe er galt. La oss trikse og mikse litt, og se om vi klarer å lure databasen, i håp om at det vil overbevise dem om at de har et problem. Vi utvider uttrykket en smule:

    http://svartarbeid.no/Kategori.asp?ID=1+OR+CatID+%3E+1

`%3E` er koden for et større-enn-tegn (`>`), mens plussene koder mellomrom. Begge ifølge reglene for URL-koding, som bør være kjent for enhver webutvikler.

Det morsomme er at denne gangen får jeg ut over 200 navn, hvorav langt de fleste ikke hører hjemme i kategorien «Frisører». Tilsynelatende får jeg ut alle medlemmene, og jeg er temmelig sikker på at jeg har klart å lure databasen til å kjøre følgende:

    SELECT ID, Title FROM Tree WHERE CatID=1 OR CatID > 1
                                           --------------

Jeg kunne trolig også fått databasen til å kjøre «`DELETE FROM Tree`», eller «`UPDATE Tree SET Title='et-eller-annet-upassende'`», og det skulle ikke forundre meg om resultatet hadde vært akkurat så kjedelig som vi frykter. Jeg forsøkte ikke.

---

Og så et annet eksempel. Jeg ba en gang på mine knær om å få se litt på en webløsning som snart skulle gå i produksjon. Tusenvis av brukere med tilhørende passord, kontoinformasjon, og ikke minst: penger. Nettopp slikt media liker å skrive om.

«Nei, vi har allerede hatt et sikkerhetsfirma til å se på denne løsningen. Super Safe AS, et av landets eldste og største sikkerhetsfirma.» Ja så, tenkte jeg. Et av disse firmaene som vet alt som er å vite om brannmurer, kryptering og datavirus, men som ikke har filla peiling på programmering. Nu vel. Jeg tilbød meg å bruke noen timer gratis, for så eventuelt å få betalt for det jeg fant. Grønt lys!

Fant nok feil til at Dagbladet ville kunne boltre seg i flere dager hvis jeg hadde snakket med dem. Jeg gjorde ikke det.

Jeg velger å fortelle dere om det morsomste hullet (som for øvrig finnes en rekke andre steder også): «Hvordan logge seg inn uten å kjenne et eneste passord.» La meg først understreke: Programmererne i dette temmelig store konsulentfirmaet er ikke dumme. De fleste av dem er trolig godt over en gjennomsnitts webutvikler. Problemet er at sin lange utdannelse til tross, er det ingen som har fortalt dem hvilke farer som lurer. Hvordan enkelte leter etter feil med en iver som er ukjent for de fleste av oss. Vel, jeg prater meg bort. Til saken!

Hvordan programmerer man logikken som sjekker at en bruker logger seg riktig inn på en tjeneste? Det er temmelig mange måter å gjøre det på, hvorav de fleste er riv, ruskende gale. Selv om de tilsynelatende virker. Man starter gjerne innloggingen med å hente inn brukernavn og passord fra et skjema på en webside. La oss være kreative og si at brukernavnet havner i en variabel `$username`, mens passordet havner i variabelen `$password`. Mange velger da å gjøre følgende SQL-spørring mot brukerdatabasen:

    "SELECT * FROM User "
    . "WHERE Username='" . $username . "' "
    . "AND Password='" . $password . "'";

En dot (`.`) angir her strengkonkatenering. Tanken er at denne spørringen skal plukke ut brukeren med matchende brukernavn og passord, og at ingen brukere vil returneres hvis brukernavnet eller passordet er feil.

Et fåtall av leserne vil nå humre litt. Kun et fåtall, ifølge min erfaring. Jeg vet om en mengde folk med alt fra selvlært til doktorgrad i informatikk som ikke ville le av dette. Hva er problemet (hvis vi ser bort fra klartekstpassordene, som er fy-fy i seg selv)? Jo, la meg nå starte med å gjette på et brukernavn. Vi snakker om tusenvis av norske brukere. Sannsynligheten er stor for at noen velger å kalle seg «ole». Eller «per». Eller «sverre», for den saks skyld. Men vi holder oss til «ole». På innloggingsbildet taster jeg:

    Brukernavn:   ole' --
    Passord:      foo

Passordet er uvesentlig, jeg taster noe bare for å komme meg forbi det dumme JavaScript'et som sjekker at jeg har tastet inn et passord. Et merkelig brukernavn, forresten. Sa jeg ikke «ole»? Vel, la oss se hva som skjer når disse verdiene dyttes inn i SQL-uttrykket over:

    SELECT * FROM User WHERE Username='ole' --' AND Password='foo'
                                       -------

Den årvåkne leser vil nå umiddelbart se hva de merkelige tegnene etter «ole» skulle bety: Først en fnutt som avslutter strengen før den egentlig skulle avsluttes, og dermed åpner for et par bindestreker som ifølge SQL92 kommenterer bort resten av linja. Vi har lurt innloggingsrutinen til å droppe passordtesten. «Velkommen, Ole Martin Pedersen.» Wow! Suksess!

Sett med en inntrengers øyne er dette selvsagt flott, fantastisk og halleluja. Neste post på programmet er å stjele penger, opptre på vegne av Ole Martin, eller ringe 1000-tipset i Dagbladet. Eller var det VG? Og glem for all del ikke at det tradisjonelle og velrenommerte sikkerhetsfirmaet «Super Safe AS» overså denne og liknende feil.

---

Hvorfor i all verden lager vi sånne opplagte feil i programmene våre? Jeg velger å skylde på utdannelsen vår. Enhver datautdannelse i Norge lærer oss å lage programmer som gjør det snille mennesker vil at de skal gjøre. Vi lærer å lage programmer som løser problemer. Håndtering av brukere som vil at programmet *ikke* skal gjøre jobben sin, er alltid «beyond the scope of» ethvert kurs. Vel og bra den gangen datamaskiner sto i låste rom og Internett var en våt drøm hos utvalgte science fiction-forfattere, men i våre dager duger det ikke.

Jeg har skummet igjennom hyllemetervis med «building E-commerce solutions» på Akademika (Universitetsbokhandelen). En haug med bøker av ulik vanskelighetsgrad. Ingen av dem sier noe om sikkerhet. Noen av dem inneholder endog like grove feil som dem vi har sett over. Er det rart vi ikke vet bedre?

---

Man kommer ikke særlig langt hvis man tror at sikkerhet kun er et tema på nettverks- og webservernivå. Det hjelper lite å engasjere et firma for å sette opp brannmur og å sjekke at alt er patchet til siste versjon så lenge man selv introduserer hull på størrelse med Arizona-krateret på toppen av det hele.

Dagens råd blir derfor omtrent som følger:

-   La sikkerhet bli en del av hele utviklingsprosessen. Lager man applikasjoner for Nettet, bør sikkerhet ha samme fokus som f.eks. brukervennlighet og eleganse. Applikasjonen din er tilgjengelig for hele verden: Sannsynligheten er trolig stor for at flertallet vil synes det er kulere å ødelegge den enn å se den gjøre jobben sin.
-   Innse at du og dine venner lager sikkerhetshull. Uansett hvor intelligente, velutdannede, erfarne, suverene eller hva det nå måtte være, dere er. Jeg gjør det selv, til tross for at jeg jobber med applikasjonssikkerhet til daglig.
-   Hjelp hverandre å finne hullene før andre gjør det, uten at det skal få dere til å føle dere som annenrangs utviklere. Har dere først innsett at alle lager hull, bør dere ikke bli veldig flaue om kollegaen oppdager dem for dere. I neste runde er rollene snudd.
-   Pek ut en ansvarlig for sikkerhetskunnskapen blant dere. La denne ildsjelen bruke noen timer hver uke til å holde seg oppdatert, og hør på det hun har å fortelle når hun siler ut noe som er relevant for resten.

La meg for ordens skyld føye til at jeg ikke på noen måte sier at infrastruktursikkerhet er uviktig. Tvert imot, hvis ikke den er på plass, er det heller ingen vits i å tenke på applikasjonssikkerhet.

Nå håper jeg for all del ikke jeg har sagt så mye at jeg tar bort hele arbeidsgrunnlaget mitt ... ;-)
