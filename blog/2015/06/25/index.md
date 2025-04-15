---
title: Dia på OS X
date: 2015-06-25
abstract: Noen notater om bruk av grafikkprogrammet [Dia](http://dia-installer.de/) på OS X.
cover-image: dia.svg
cover-image-width: 70
stylesheet: style.css
---

Hvis Dia krasjer
----------------

Hvis [Dia](http://dia-installer.de/) krasjer på OS X Yosemite pga. en GTK-feil, retter følgende [løsning](http://navkirats.blogspot.no/2014/10/dia-diagram-mac-osx-yosemite-fix-i-use.html) opp problemet:

1.  Åpne filen `/Applications/Dia.app/Contents/Resources/bin/dia` i en teksteditor.
2.  Legg til linjen `export DISPLAY=:0` etter linje 39.
3.  Avslutt XQuartz hvis det kjører og start Dia på nytt.

(Hvis det ovenstående ikke fungerer, kan man prøve å legge til `export DISPLAY=:0` i `~/.bash_profile`.)

Eksportere til PDF
------------------

For å lage PDF, er det best å eksportere til EPS (med Pango-skrifter) og deretter [konvertere til PDF](http://www.dark.ca/2009/07/16/getting-dia-to-give-you-a-pdf/):

    epstopdf diagram.eps

`epstopdf` er inkludert i TeX Live ([MacTeX](http://tug.org/mactex/)).

Konvertere PDF til SVG
----------------------

### Med `pdf2svg`

For å konvertere til SVG, fungerer det bedre å gå [omveien om PDF](http://superuser.com/questions/198460/converting-from-eps-to-svg-format#answer-542987) enn å eksportere direkte eller konvertere fra EPS. PDF kan konverteres til SVG med [`pdf2svg`](http://www.cityinthesky.co.uk/opensource/pdf2svg/) (kan installeres med `brew install pdf2svg`):

    pdf2svg diagram.pdf diagram.svg

For å konvertere en bestemt side:

    pdf2svg diagrammer.pdf diagram.svg 20

`pdf2svg` har dessverre ingen valg for beskjæring. For dette kan man benytte [PDF Scissors](https://sites.google.com/site/pdfscissors/) (grafisk) eller [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) (kommandolinje).

### Med Inkscape

Det ser ut til at `pdf2svg` har problemer med å konvertere enkelte PDF-er. Et alternativ er å bruke [Inkscape](http://inkscape.org/), som kan [kjøres fra terminalen](http://stackoverflow.com/questions/10288065/convert-pdf-to-clean-svg#answer-10290006):

    inkscape --without-gui --file=diagram.pdf --export-plain-svg=diagram.svg

Dette er visstnok den foretrukne konverteringsmetoden til [Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Graphics_Lab/Resources/PDF_conversion_to_SVG#Conversion_with_Inkscape).

<!-- (Hvis Inkscape ikke gjenkjennes i terminalen, legg til `C:\Program Files\Inkscape` i miljøvariabelen `PATH`.) -->
