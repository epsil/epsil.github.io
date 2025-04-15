---
title: Testing med Selenium
abstract: Hvordan kombinere Selenium, mocha og chai.
aliases:
  - Selenium
date: 2015-12-10
cover-image: selenium.png
cover-image-width: 100
include-before: '![](steria.svg){width=150}'
stylesheet: style.css
---

Selenium
--------

-   Testrammeverk for webapplikasjoner
-   Skrevet i Java
-   Gjør det mulig å lage makroer for en nettleser
    -   Åpne en adresse
    -   Finne et element
    -   Klikke på elementet
    -   ...

selenium-webdriver
------------------

-   JavaScript-grensesnitt for Selenium
-   Kan kombineres med andre JavaScript-biblioteker:
    -   mocha
    -   chai, chai-as-promised
-   Installeres med npm:
    -   `npm install selenium-webdriver`

ChromeDriver
------------

-   Oppretter forbindelse til Chrome-instans
-   Kan installeres med npm eller lastes ned separat:
    -   <http://sites.google.com/a/chromium.org/chromedriver/>
    -   `ChromeDriver.exe` må ligge i `PATH`

Installasjon
------------

1.  npm
    -   <http://nodejs.org/>
2.  ChromeDriver
    -   <http://sites.google.com/a/chromium.org/chromedriver/>
3.  selenium-webdriver
    -   `npm install selenium-webdriver`
4.  Mocha
    -   `npm install -g mocha`
5.  Chai
    -   `npm install chai`
    -   `npm install chai-as-promised`

Filstruktur
-----------

    test/
    |-- test.js
    `-- node_modules/
        |-- selenium_webdriver/
        |-- chai/
        |-- chai-as-promised/
        `-- ...

Kjøres med:

    mocha test.js

[test.js](test.js)
------------------

```javascript
var selenium = require('selenium-webdriver');
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;

before(function() {
  this.timeout(60000);
  this.driver = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build();
  return this.driver.getWindowHandle();
});

after(function() {
  return this.driver.quit();
});

describe('Component', function() {
  // ...
});
```

[test.js](test.js), del 2
-------------------------

```javascript
describe('Component', function() {
  beforeEach(function() {
    // ...
  });

  afterEach(function() {
    // ...
  });

  it('should work as expected', function() {
    // Selenium test code here
  });
});
```

Resultat:

-   Component should work as expected: ✔

[test.js](test.js), del 3
-------------------------

```javascript
describe('Search field', function() {
  it('should clear when selected', function() {
    this.driver.get('http://...');
    var searchField = this.driver.findElement({ css: '#searchField' });
    searchField.click();
    return expect(searchField.getText()).to.eventually.equal('');
  });
});
```

Resultat:

-   Search field should clear when selected: ✔

Linker
------

-   [test.js](test.js)
-   [Getting started with Selenium Webdriver for node.js](http://bites.goodeggs.com/posts/selenium-webdriver-nodejs-tutorial/)
-   [Selenium With Node.js and Mocha](http://simpleprogrammer.com/2014/02/03/selenium-with-node-js/)
