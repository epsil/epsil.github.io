---
title: Bruke `grep` og `find`
date: 2010-11-14
---

`grep`
------

For å søke i filenes *innhold*, kan man bruke `grep`:

```bash
grep -Ri "test" .
```

Dette søker rekursivt (`-R`) og case-insensitivt (`-i`) etter teksten `"test"` i den gjeldende mappen (`.`). Hvis man *bare* vil søke i, si, `.txt`-filer, kan man bruke `--include`-opsjonen:

```bash
grep -Ri --include="*.txt" "test" .
```

Det finnes også en `--exclude`-opsjon for å ekskludere filer fra søket.

`find`
------

For å søke i filenes *filnavn*, kan man bruke `find`. Merk at hvis man skal bruke `find` sammen med f.eks. `rm` på filnavn som inneholder mellomrom, må man ta visse [forhåndsregler](http://stackoverflow.com/questions/9612090/how-to-loop-through-file-names-returned-by-find#9612232). Den mest opplagte besvergelsen ville være:

```bash
find . -name <PATTERN> | xargs rm
```

Men dette fungerer altså bare på filnavn uten mellomrom. For mer kronglete filer må man bruke en av disse:

```bash
find . -name <PATTERN> -exec rm {} \;
find . -name <PATTERN> -print0 | xargs -0 rm
```

Den første eksekverer `rm` via `find`. Den siste bruker opsjonen `-print0` for å terminere filnavn med `\0` istedenfor linjeskift, og `rm` gjøres oppmerksom på dette med opsjonen `-0`. Begge programmer må altså tilpasses for å kunne samarbeide om spesielle filnavn.^[Fortrinnet med `\0`-metoden er at den håndterer de mest *outrerte* filnavn, selv navn som inneholder linjeskift! Jeg visste ikke at det var mulig før jeg leste `man find`, men `touch 'some\` + <kbd>Enter</kbd> + `file'` vil lage en slik fil. (Bytt ut «`touch`» med «`rm`» for å slette filen.)]
