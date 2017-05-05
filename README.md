# node-sales-tax

[![Build Status](https://img.shields.io/travis/valeriansaliou/node-sales-tax/master.svg)](https://travis-ci.org/valeriansaliou/node-sales-tax) [![Test Coverage](https://img.shields.io/coveralls/valeriansaliou/node-sales-tax/master.svg)](https://coveralls.io/github/valeriansaliou/node-sales-tax?branch=master) [![NPM](https://img.shields.io/npm/v/sales-tax.svg)](https://www.npmjs.com/package/sales-tax) [![Downloads](https://img.shields.io/npm/dt/sales-tax.svg)](https://www.npmjs.com/package/sales-tax)

International sales tax calculator for Node (offline, except for VAT number validation). Tax rates are kept up-to-date.

You may use it to calculate VAT rates for countries in the European Union (VAT MOSS), GST in Canada, or get VAT for countries such as China, or even Hong Kong (which has no VAT).

_You can find the raw sales tax rates JSON file here: [sales_tax_rates.json](https://github.com/valeriansaliou/node-sales-tax/blob/master/res/sales_tax_rates.json)_

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://crisp.im/"><img src="https://valeriansaliou.github.io/node-sales-tax/images/crisp.png" height="64" /></a></td>
</tr>
<tr>
<td align="center">Crisp</td>
</tr>
</table>

_👋 You use sales-tax and you want to be listed there? [Contact me](https://valeriansaliou.name/)!_

## How to install?

Include `sales-tax` in your `package.json` dependencies.

Alternatively, you can run `npm install sales-tax --save`.

## How to use?

This module may be used to acquire the billable VAT percentage for a given customer. You may also use it directly to process the total amount including VAT you should bill; and even to validate a customer's VAT number.

**:red_circle: Important: in order to fetch the sales tax for a customer, you need to know their country (and sometimes state). The country (sometimes state) must be passed to all module methods, formatted as ISO ALPHA-2 (eg. France is FR, United States is US).**

### :arrow_right: Import the module

Import the module in your code:

`var SalesTax = require("sales-tax");`

### :white_check_mark: Check if a country has sales tax

**Prototype:** `SalesTax.hasSalesTax(countryCode<string>)<boolean>`

**Check some countries for sales tax** (returns `true` or `false`):

```javascript
var franceHasSalesTax = SalesTax.hasSalesTax("FR")  // franceHasSalesTax === true
var brazilHasSalesTax = SalesTax.hasSalesTax("BR")  // brazilHasSalesTax === true
var hongKongHasSalesTax = SalesTax.hasSalesTax("HK")  // hongKongHasSalesTax === false
```

### :white_check_mark: Check if a state has sales tax (in a country)

**Prototype:** `SalesTax.hasStateSalesTax(countryCode<string>, stateCode<string>)<boolean>`

:canada: **Check some Canada states for sales tax** (returns `true` or `false`):

```javascript
var canadaQuebecHasSalesTax = SalesTax.hasSalesTax("CA", "QC")  // canadaQuebecHasSalesTax === true
var canadaYukonHasSalesTax = SalesTax.hasSalesTax("CA", "YT")  // canadaYukonHasSalesTax === false
```

:us: **Check some US states for sales tax** (returns `true` or `false`):

```javascript
var unitedStatesCaliforniaHasSalesTax = SalesTax.hasSalesTax("US", "CA")  // unitedStatesCaliforniaHasSalesTax === true
var unitedStatesDelawareHasSalesTax = SalesTax.hasSalesTax("US", "DE")  // unitedStatesDelawareHasSalesTax === false
```

### :white_check_mark: Get the sales tax for a customer

**Prototype:** `SalesTax.getSalesTax(countryCode<string>, stateCode<string?>, taxNumber<string?>)<Promise<object>>`

:fr: **Given a French customer VAT number** (eg. here `SAS CLEVER CLOUD` with VAT number `FR 87524172699`):

```javascript
SalesTax.getSalesTax("FR", null, "87524172699")
  .then((tax) => {
    // This customer is VAT-exempt (as it is a business)
    /* tax ===
      {
        type   : "vat",
        rate   : 0.00,
        exempt : true
      }
     */
  });
```

Note: Clever-Cloud is a real living business from France, check [their website there](https://www.clever-cloud.com).

:us: **Given an United States > California customer without any VAT number** (eg. a physical person):

```javascript
SalesTax.getSalesTax("US", "CA")
  .then((tax) => {
    // This customer has to pay 8.25% VAT (as it is a physical person)
    /* tax ===
      {
        type   : "vat",
        rate   : 0.0825,
        exempt : false
      }
     */
  });
```

:latvia: **Given a Latvian customer without any VAT number** (eg. a physical person):

```javascript
SalesTax.getSalesTax("LV")
  .then((tax) => {
    // This customer has to pay 21% VAT (as it is a physical person)
    /* tax ===
      {
        type   : "vat",
        rate   : 0.21,
        exempt : false
      }
     */
  });
```

:hong_kong: **Given an Hong Kong-based customer** (eg. a physical person):

```javascript
SalesTax.getSalesTax("HK")
  .then((tax) => {
    // Hong Kong has no VAT
    /* tax ===
      {
        type   : "none",
        rate   : 0.00,
        exempt : true
      }
     */
  });
```

:es: **Given a Spanish customer who provided an invalid VAT number** (eg. a rogue individual):

```javascript
SalesTax.getSalesTax("ES", null, "12345523")
  .then((tax) => {
    // This customer has to pay 21% VAT (VAT number could not be authenticated against the European Commission API)
    /* tax ===
      {
        type   : "vat",
        rate   : 0.21,
        exempt : false
      }
     */
  });
```

### :white_check_mark: Process the price including sales tax for a customer

**Prototype:** `SalesTax.getAmountWithSalesTax(countryCode<string>, stateCode<string?>, amount<number?>, taxNumber<string?>)<Promise<object>>`

:estonia: **Given an Estonian customer without any VAT number, buying 100.00€ of goods** (eg. a physical person):

```javascript
SalesTax.getAmountWithSalesTax("EE", null, 100.00)
  .then((amountWithTax) => {
    // This customer has to pay 20% VAT
    /* amountWithTax ===
      {
        type   : "vat",
        rate   : 0.20,
        exempt : false,
        price  : 100.00,
        total  : 120.00
      }
     */
  });
```

### :white_check_mark: Validate tax number for a customer

**Prototype:** `SalesTax.validateTaxNumber(countryCode<string>, taxNumber<string?>)<Promise<boolean>>`

:fr: **Given a French customer VAT number** (eg. here `SAS CLEVER CLOUD` with VAT number `FR 87524172699`):

```javascript
SalesTax.validateTaxNumber("FR", "87524172699")
  .then((isValid) => {
    // isValid === true
  });
```

:us: **Given an United States customer without any VAT number** (eg. a physical person):

```javascript
SalesTax.validateTaxNumber("US")
  .then((isValid) => {
    // isValid === false
  });
```

:latvia: **Given a Latvian customer without any VAT number** (eg. a physical person):

```javascript
SalesTax.validateTaxNumber("LV")
  .then((isValid) => {
    // isValid === false
  });
```

:es: **Given a Spanish customer who provided an invalid VAT number** (eg. a rogue individual):

```javascript
SalesTax.validateTaxNumber("ES", "12345523")
  .then((isValid) => {
    // isValid === false
  });
```

### :white_check_mark: Check if a customer is tax-exempt

**Prototype:** `SalesTax.isTaxExempt(countryCode<string>, stateCode<string?>, taxNumber<string?>)<Promise<boolean>>`

:fr: **Given a French customer VAT number** (eg. here `SAS CLEVER CLOUD` with VAT number `FR 87524172699`):

```javascript
SalesTax.isTaxExempt("FR", null, "87524172699")
  .then((isTaxExempt) => {
    // isTaxExempt === true
  });
```

:morocco: **Given a Morocco-based customer**:

```javascript
SalesTax.isTaxExempt("MA")
  .then((isTaxExempt) => {
    // isTaxExempt === false
  });
```

:us: **Given an United States > Delaware-based customer**:

```javascript
SalesTax.isTaxExempt("US", "DE")
  .then((isTaxExempt) => {
    // isTaxExempt === true
  });
```

:hong_kong: **Given an Hong Kong-based customer**:

```javascript
SalesTax.isTaxExempt("HK")
  .then((isTaxExempt) => {
    // isTaxExempt === true
  });
```

### :white_check_mark: Disable / enable tax number validation

**Prototype:** `SalesTax.toggleEnabledTaxNumberValidation(enabled<boolean>)<undefined>`

**Disable tax number validation** (disable hitting against external APIs and consider all tax numbers as valid):

```javascript
SalesTax.toggleEnabledTaxNumberValidation(false)
```

**Enable tax number validation** (enabled by default — use only if you disabled it previously):

```javascript
SalesTax.toggleEnabledTaxNumberValidation(true)
```

## Where is the offline tax data is pulled from?

The offline tax data is pulled from [VAT, GST and sales tax rates — ey.com](http://www.ey.com/gl/en/services/tax/worldwide-vat--gst-and-sales-tax-guide---rates).

**It is kept up-to-date year-by-year with tax changes worldwide.**

Some countries have multiple sales tax, eg. Brazil. In those cases, the returned sales tax is the one on services. Indeed, I consider most users of this module use it for their SaaS business — _in other words, service businesses._

## How are tax numbers validated?

For now, this module only supports tax number (VAT number) validation for European countries.

### :eu: Europe

European VAT numbers are validated against the official `ec.europa.eu` API, which return whether a given VAT number exists or not. This helps you ensure a customer-provided VAT number is valid (ie. you don't have to bill VAT for this customer).

You can manually check a VAT number on [VIES VAT number validation](http://ec.europa.eu/taxation_customs/vies/vatRequest.html).

### :us: United States

United States EIN (U.S. Employer Identification Number) are validated against EIN format rules.

### :canada: Canada

Canada BN (Business Number) are validated against BN format rules.

### :black_flag: Rest of the world

If a country or economic community is not listed here, provided tax identification numbers are ignored for those countries (considered as invalid — so do not rely on validation methods as a source of truth).

_If you need tax number validation for a missing country, feel free to submit a Pull Request._
