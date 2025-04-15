---
title: XML og XHTML
date: 2004-02-03
---

Det store argumentet for XHTML er rett og slett -- *XML.* Det er et faktum at XML-støtten i verden er ubegripelig mye bedre enn SGML-støtten, og dette henger sammen med at XML er en forholdsvis ukomplisert standard som det er lett å utvikle verktøy for. Å «bevare» data i XML helt fra produksjon til distribusjon muliggjør effektiv og lettvint behandling av data (og ikke minst «metadata» -- informasjon om og relasjoner mellom data), fordi XML-formater kan sikre at innholdets *struktur* ivaretas. Dessuten vil serverbaserte XML-teknologier som [emnekart](http://www.ontopia.net/topicmaps/materials/tao.html) kunne øke søkeytelsen i webdatabaser betraktelig, noe som er en god ting også for dem som befinner seg på klientsiden.

Men tilbake til Web og XML -- og dermed XHTML. Det er et velkjent faktum at XML også muliggjør *kombinering av ulike XML-standarder,* noe som har et stort potensial på Web. Et glimrende eksempel er [MathML](http://www.w3.org/Math/), som kan [innlemmes i websider](http://home.online.no/%7Enoey/3MX.png) ved å bruke W3C sin [XHTML 1.1 + MathML 2.0-DTD](http://www.w3.org/TR/MathML2/appendixa.html#parsing.module). Argumentet om W3C sine mange spennende XML-standarder har foreløpig ikke vært så inspirerende grunnet ikke-eksisterende eller ufullstendig støtte i dagens programvare, men nå ser det heldigvis ut til at teknologien er i utvikling også på dette området.

Det neste argumentet er at strukturbasert XHTML (for tiden helst XHTML 1.0 Strict eller XHTML 1.1) tenkes å ta over for distribueringen av såkalte trådløse data, og erstatte det ikke særlig semantiske (og, etter min mening, svært dårlige) WML-formatet. Ved å bruke XHTML når man altså ut til *flere* enn med SGML-HTML -- selvsagt et must for teknofriker og perfeksjonister som meg selv!

Hva såkalt validering angår, stikker den gamle DTD-teknologiens utdaterte og begrensede restriksjonskraft ofte kjepper i hjulene for bruken av mer avanserte XML-språk. Men det spennende med XML er at det er fleksibelt nok til å *utvide seg selv,* og XML-språk som [Relax NG](http://www.relaxng.org/) og [XML-skjemaer](http://www.w3.org/XML/Schema) ventes å ta over for dette i fremtiden -- noe som endelig kan gjøre gyldig HTML synonymt med strukturbasert HTML.

At sider som [Stopdesign](http://www.stopdesign.com/) og [mezzoblue](http://www.mezzoblue.com/) bruker XHTML finner jeg egentlig ikke så overraskende -- disse baserer seg på [Movable Type](http://www.movabletype.org/), et webpubliseringsverktøy som produserer XHTML som standard. (Her må selvfølgelig også RSS nevnes -- et XML-format beregnet på å publisere sammendrag eller syndikere innhold, og et must for hyppig oppdaterte nettsteder.)

Det mest interessante hva XHTML angår er formatets fremtid -- [XHTML 2.0](http://www.w3.org/TR/xhtml2/), som ikke er bakoverkompatibelt med de eldre HTML-versjonene, og vektlegger struktur og semantikk i langt større grad. Nye formater vil alltid gjøre informasjon mindre tilgjengelig i en startfase, men dette kan også være måten å endelig kaste «dinosauren» IE av banen på (med mindre Microsoft for én gangs skyld bestemmer seg for å foreta noe fornuftig).
