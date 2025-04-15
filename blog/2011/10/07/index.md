---
title: Closures i Lisp
date: 2011-10-07
---

> In the remotest regions, beyond the Functional Kingdoms, lies a fabled realm called Lambda the Ultimate. In this place it is said that there are no nouns at all, only verbs! There are "things" there, but all things are created from verbs, even the very integers for counting lambs, which are the most popular form of trading currency there, if the rumors speak truth. The number zero is simply `lambda()`, and 1 is `lambda(lambda())`, 2 is `lambda(lambda(lambda()))`, and so on. Every single Thing in this legendary region, be it noun, verb or otherwise, is constructed from the primal verb "lambda".
>
> -- Steve Yegge: *[Execution in the Kingdom of Nouns](http://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html)*^[<http://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html>]

Det er i prinsippet mulig å bruke lambdaer som et fundament for videre programmering. Det klassiske [*SICP*](http://mitpress.mit.edu/sicp/full-text/book/book.html)-eksemplet er å definere `cons`, `car` og `cdr` på denne måten,^[<http://mitpress.mit.edu/sicp/full-text/book/book-Z-H-14.html#%_sec_2.1.3>] som vi kan tenke på som Lisp-sjargong for `pair`, `first` og `second`. La `pair` være en funksjon som returnerer et par med verdier, `first` returnere den første verdien til paret, og `second` returnere den andre:

```scheme
> (pair "foo" "bar")
#<par av "foo" og "bar">

> (first (pair "foo" "bar"))
"foo"

> (second (pair "foo" "bar"))
"bar"
```

Den vanlige måten å implementere dette på ville være å konstruere en listestruktur -- et stykke data -- med `pair`, og så la `first` og `second` hente ut riktig element fra strukturen. *SICP* sin fremgangsmåte er derimot å implementere paret som en *prosedyre*:

```scheme
(define (pair x y)
  (lambda (m)
    (cond
     ((= m 1) x)
     ((= m 2) y))))

(define (first z)
  (z 1))

(define (second z)
  (z 2))
```

Her returnerer `pair` en anonym funksjon (som lages med `lambda` i Lisp). Denne funksjonen inneholder argumentene til `pair`:

```scheme
> (pair "foo" "bar")
#<prosedyre som inneholder "foo" og "bar">
```

Det `first` og `second` så gjør, er å kalle prosedyren med et bestemt argument slik at den første eller andre verdien returneres. Dermed vil `(first (pair "foo" "bar"))` fortsatt gi `"foo"`, og `(second (pair "foo" "bar"))` gi `"bar"`. På papiret en helt adekvat implementasjon.

<!--
Se [GeirGrusoms innlegg](http://www.diskusjon.no/index.php?showtopic=800754&p=18412466&st=1420&#entry18412466) over.
-->

Koden over forutsetter *closures*, dvs. at prosedyren som `pair` returnerer, er i stand til å «stikke av med» argumentene til `pair`.^[Hvis Lisp'en din mangler dette, kan du alltids «jukse» ved å konstruere lambdaen som en liste og splice inn verdiene av `x` og `y` (forutsetter at `x` og `y` er immutable).] Dermed kan man for så vidt tenke på prosedyren som et «objekt», dvs. en bunt med data og instruksjoner. (I enkelte språk, som JavaScript og Scala, *er* funksjoner objekter.)

Denne litt alternative måten å konstruere «objekter» på -- å lage anomyme funksjoner som lukker om bindingene i et leksikalsk skop -- er faktisk mye brukt i funksjonelle språk. Google «[let over lambda](http://www.google.no/search?q=let+over+lambda)» når du har tid.
