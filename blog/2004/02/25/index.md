---
title: Punktmerker i CSS
date: 2004-02-25
---

Du skal *aldri* bruke en bindestrek som punktmerke i en liste, men derimot en [tankestrek](http://www.sprakrad.no/tanke.htm), som har Unicode-plasseringen U+2013. I både Mozilla- og Opera-støttet CSS2 blir dette slik:

```css
ul {
    list-style: none;
    margin: 0;
    padding: 0 1em;
}
ul li:before {
    content: "\2013\A0"; /* setter inn en tankestrek
                            etterfulgt av et hardt mellomrom */
    display: marker;
    padding-right: .25em;
}
```

`margin`{.css}- og `padding`{.css}-deklarasjonene er bare min måte å oppnå passende avstander på; du kan selvsagt justere disse etter behov.

Men så var det IE, da -- som ikke støtter verken `content`{.css}-egenskapen eller pseudoelementet `:before`{.css}, og som følge av den øverste stilregelen ikke viser punktmerker i det hele tatt. Den eneste måten å (til en viss grad) få det som vi ønsker på er ved å bruke et et lite bilde i GIF- eller PNG-format (bruk PNG!), som vi setter inn foran hvert `li`{.html}-element med stilregelen

```css
ul {
     list-style-image: url("strek.png");
}
```

Vi ønsker selvsagt ikke at denne stilregelen skal brukes av Mozilla og Opera, da dette vil føre til *to* streker foran hver `li`{.html} (urk). Derfor plasserer vi heller denne regelen i et eget stilark kun for Internet Explorer, som vi i HTML-dokumentene refererer til med følgende kode:

```html
<!--[if IE]>
  <link href="IE.css" rel="stylesheet" type="text/css">
<![endif]-->
```

Bildeløsningen er en *svak* løsning, som ikke skalerer så veldig bra. Men den er fortsatt mye bedre enn å kludre til markeringen med «presentasjonsorienterte» streker, og gjør at listene også vil fungere i nettlesere uten CSS-støtte (fordi *strukturen* i dokumentet er bevart).
