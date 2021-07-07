# node-sales-tax

[![Test and Build](https://github.com/valeriansaliou/node-sales-tax/workflows/Test%20and%20Build/badge.svg?branch=master)](https://github.com/valeriansaliou/node-sales-tax/actions?query=workflow%3A%22Test+and+Build%22) [![NPM](https://img.shields.io/npm/v/sales-tax.svg)](https://www.npmjs.com/package/sales-tax) [![Downloads](https://img.shields.io/npm/dt/sales-tax.svg)](https://www.npmjs.com/package/sales-tax) [![Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg)](https://www.buymeacoffee.com/valeriansaliou)

International sales tax calculator for Node (offline, but provides optional online VAT number fraud check). Tax rates are kept up-to-date.

You may use it to calculate VAT rates for countries in the European Union (VAT MOSS), GST in Canada, or get VAT for countries such as China, or even Hong Kong (which has no VAT).

International tax is hard (especially VAT). This library ensures rules are enforced in the code. If you see a rule that is missing or not correctly enforced, please [open an issue](https://github.com/valeriansaliou/node-sales-tax/issues). Also, when you use the library, make sure to [specify your origin country](#white_check_mark-specify-the-country-you-charge-from); as it will return full international tax rates if you don't specify it (ie. the country you invoice your customers from).

_You can find the raw sales tax rates JSON file here: [sales_tax_rates.json](https://github.com/valeriansaliou/node-sales-tax/blob/master/res/sales_tax_rates.json)_

**🇺🇸 Crafted in Portland, Maine, USA.**

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://crisp.chat/"><img src="https://valeriansaliou.github.io/node-sales-tax/images/crisp.png" width="64" /></a></td>
<td align="center"><a href="https://locize.com/"><img src="https://valeriansaliou.github.io/node-sales-tax/images/locize.png" width="64" /></a></td>
<td align="center"><a href="https://turnshift.app/"><img src="https://valeriansaliou.github.io/node-sales-tax/images/turnshift.png" width="64" /></a></td>
<td align="center"><a href="https://tally.so/"><img src="https://valeriansaliou.github.io/node-sales-tax/images/tally.png" width="64" /></a></td>
</tr>
<tr>
<td align="center">Crisp</td>
<td align="center">Locize</td>
<td align="center">TurnShift</td>
<td align="center">Tally</td>
</tr>
</table>

_👋 You use sales-tax and you want to be listed there? [Contact me](https://valeriansaliou.name/)._

## Last changes

The version history can be found in the [CHANGELOG.md](https://github.com/valeriansaliou/node-sales-tax/blob/master/CHANGELOG.md) file.

_As this library is SemVer-compatible, any breaking change would be released as a MAJOR version only. Non-breaking changes and features are released as MINOR. Tax rate updates and bug fixes are released as PATCH (note that tax rate updates may as well be bundled under a MINOR release, if it comes with new features or minor changes)._

## How to install?

Include `sales-tax` in your `package.json` dependencies.

Alternatively, you can run `npm install sales-tax --save`.

## How to use?

This module may be used to acquire the billable VAT percentage for a given customer. You may also use it directly to process the total amount including VAT you should bill; and even to validate a customer's VAT number.

**:red_circle: Important: in order to fetch the sales tax for a customer, you need to know their country (and sometimes state). The country (sometimes state) must be passed to all module methods, formatted as ISO ALPHA-2 (eg. France is FR, United States is US).**

### :arrow_right: Import the module

Import the module in your code:

`var SalesTax = require("sales-tax");`

Ensure that you [specify your origin country](#white_check_mark-specify-the-country-you-charge-from) before you use the library. This will affect how `worldwide`, `regional` and `national` area taxes are handled from your point of view (`regional` stands for the economic community, eg. the European Union).

Also, ensure that you consume correctly the `charge` values that get returned. It tells you if the VAT charge should be directly invoiced to the customer via the `direct` tag (you charge the VAT on your end), or if the customer should pay the VAT on their end via the `reverse` tag (see [VAT reverse charge](https://www.vatlive.com/eu-vat-rules/eu-vat-returns/reverse-charge-on-eu-vat/)). If the charge is not `direct`, then the VAT rate will be `0.00` (it is up to the customer to apply their own VAT rate).

### :white_check_mark: Specify the country you charge from

**Prototype:** `SalesTax.setTaxOriginCountry(countryCode<string>, useRegionalTax<boolean?>)<undefined>`

:fr: **Charge customers from France** if liable to VAT MOSS (thus `worldwide`, `regional` and `national` VAT gets calculated from a French point of view):

```javascript
SalesTax.setTaxOriginCountry("FR")
```

:fr: **Charge customers from France** if not liable to VAT MOSS (thus `worldwide`, `regional` and `national` VAT gets calculated from a French point of view):

```javascript
// Set the 'useRegionalTax' argument to false if not liable to VAT MOSS (eg. not enough turnover in another regional country)
SalesTax.setTaxOriginCountry("FR", false)
```

:triangular_flag_on_post: **Unset your origin country** (use default origin, full VAT rates will be applied for all countries worldwide — **_this is obviously not usable for your invoices_**):

```javascript
SalesTax.setTaxOriginCountry(null)
```

### :white_check_mark: Check if a country has sales tax

**Prototype:** `SalesTax.hasSalesTax(countryCode<string>)<boolean>`

**Notice: this method is origin-neutral. It means it return values regardless of your configured tax origin country.**

**Check some countries for sales tax** (returns `true` or `false`):

```javascript
var franceHasSalesTax = SalesTax.hasSalesTax("FR")  // franceHasSalesTax === true
var brazilHasSalesTax = SalesTax.hasSalesTax("BR")  // brazilHasSalesTax === true
var hongKongHasSalesTax = SalesTax.hasSalesTax("HK")  // hongKongHasSalesTax === false
```

### :white_check_mark: Check if a state has sales tax (in a country)

**Prototype:** `SalesTax.hasStateSalesTax(countryCode<string>, stateCode<string>)<boolean>`

**Notice: this method is origin-neutral. It means it return values regardless of your configured tax origin country.**

:canada: **Check some Canada states for sales tax** (returns `true` or `false`):

```javascript
var canadaQuebecHasSalesTax = SalesTax.hasStateSalesTax("CA", "QC")  // canadaQuebecHasSalesTax === true
var canadaYukonHasSalesTax = SalesTax.hasStateSalesTax("CA", "YT")  // canadaYukonHasSalesTax === false
```

:us: **Check some US states for sales tax** (returns `true` or `false`):

```javascript
var unitedStatesCaliforniaHasSalesTax = SalesTax.hasStateSalesTax("US", "CA")  // unitedStatesCaliforniaHasSalesTax === true
var unitedStatesDelawareHasSalesTax = SalesTax.hasStateSalesTax("US", "DE")  // unitedStatesDelawareHasSalesTax === false
```

### :white_check_mark: Get the sales tax for a customer

**Prototype:** `SalesTax.getSalesTax(countryCode<string>, stateCode<string?>, taxNumber<string?>)<Promise<object>>`

**Notice: this method is origin-aware. It means it return values relative to your configured tax origin country.**

:fr: **Given a French customer VAT number** (eg. here `SARL CRISP IM` with VAT number `FR 50833085806`):

```javascript
SalesTax.getSalesTax("FR", null, "FR50833085806")
  .then((tax) => {
    // This customer is VAT-exempt (as it is a business)
    /* tax ===
      {
        type     : "vat",
        rate     : 0.00,
        area     : "worldwide",
        exchange : "business",

        charge   : {
          direct  : false,
          reverse : true
        },

        details  : []
      }
     */
  });
```

Note: Crisp is a real living business from France, check [their website there](https://crisp.chat/).

:fr: **Given a French customer VAT number from a :fr: French tax origin** (eg. here `SARL CRISP IM` with VAT number `FR 50833085806`):

```javascript
// Set this once when initializing the library (to France)
SalesTax.setTaxOriginCountry("FR")

SalesTax.getSalesTax("FR", null, "FR50833085806")
  .then((tax) => {
    // This customer owes VAT in France (as it is a business, and billing is FR-to-FR)
    // The `direct` tag is set to `true`, thus VAT should be charged
    // The `area` tag is set to `national` as the exchange is done in France
    /* tax ===
      {
        type     : "vat",
        rate     : 0.20,
        area     : "national",
        exchange : "business",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type : "vat",
            rate : 0.20
          }
        ]
      }
     */
  });
```

:fr: **Given a French customer VAT number from a :latvia: Latvian tax origin** (eg. here `SARL CRISP IM` with VAT number `FR 50833085806`):

```javascript
// Set this once when initializing the library (to Latvia)
SalesTax.setTaxOriginCountry("LV")

SalesTax.getSalesTax("FR", null, "FR50833085806")
  .then((tax) => {
    // This customer owes a VAT reverse charge in their country (France), no VAT is due in Latvia
    // The `reverse` tag is set to `true`, thus the customer should apply a reverse VAT charge in their country
    // The `area` tag is set to `regional` as the exchange is done in the European Union
    /* tax ===
      {
        type     : "vat",
        rate     : 0.00,
        area     : "regional",
        exchange : "business",

        charge   : {
          direct  : false,
          reverse : true
        },

        details  : []
      }
     */
  });
```

:us: **Given an United States > California customer without any VAT number** (eg. a consumer):

```javascript
SalesTax.getSalesTax("US", "CA")
  .then((tax) => {
    // This customer has to pay 8.25% VAT (as it is a consumer)
    /* tax ===
      {
        type     : "vat",
        rate     : 0.0825,
        area     : "worldwide",
        exchange : "consumer",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type : "vat",
            rate : 0.0825
          }
        ]
      }
     */
  });
```

:canada: **Given a Canada > Ontario customer without any VAT number** (eg. a consumer):

```javascript
SalesTax.getSalesTax("CA", "ON")
  .then((tax) => {
    // This customer has to pay 5% GST + 8% HST (as it is a consumer)
    /* tax ===
      {
        type     : "gst+hst",
        rate     : 0.13,
        area     : "worldwide",
        exchange : "consumer",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type : "gst",
            rate : 0.05
          },

          {
            type : "hst",
            rate : 0.08
          }
        ]
      }
     */
  });
```

:latvia: **Given a Latvian customer without any VAT number** (eg. a consumer):

```javascript
SalesTax.getSalesTax("LV")
  .then((tax) => {
    // This customer has to pay 21% VAT (as it is a consumer)
    /* tax ===
      {
        type     : "vat",
        rate     : 0.21,
        area     : "worldwide",
        exchange : "consumer",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type : "vat",
            rate : 0.21
          }
        ]
      }
     */
  });
```

:latvia: **Given a Latvian customer without any VAT number from a :fr: French tax origin** (eg. a consumer):

```javascript
// Set this once when initializing the library (to France)
SalesTax.setTaxOriginCountry("FR")

SalesTax.getSalesTax("LV")
  .then((tax) => {
    // This customer owes VAT in Latvia (as it is a consumer, and billing is FR-to-LV)
    // The `direct` tag is set to `true`, thus VAT should be charged
    // The `area` tag is set to `regional` as the exchange is done in the European Union
    /* tax ===
      {
        type     : "vat",
        rate     : 0.21,
        area     : "regional",
        exchange : "consumer",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type : "vat",
            rate : 0.21
          }
        ]
      }
     */
  });
```

:hong_kong: **Given an Hong Kong-based customer** (eg. a consumer):

```javascript
SalesTax.getSalesTax("HK")
  .then((tax) => {
    // Hong Kong has no VAT
    /* tax ===
      {
        type     : "none",
        rate     : 0.00,
        area     : "worldwide",
        exchange : "consumer",

        charge   : {
          direct  : false,
          reverse : false
        },

        details  : []
      }
     */
  });
```

:es: **Given a Spanish customer who provided an invalid VAT number** (eg. a rogue business):

```javascript
SalesTax.getSalesTax("ES", null, "ESX12345523")
  .then((tax) => {
    // This customer has to pay 21% VAT (VAT number could not be authenticated against the VIES VAT API)
    /* tax ===
      {
        type     : "vat",
        rate     : 0.21,
        area     : "worldwide",
        exchange : "consumer",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type : "vat",
            rate : 0.21
          }
        ]
      }
     */
  });
```

### :white_check_mark: Process the price including sales tax for a customer

**Prototype:** `SalesTax.getAmountWithSalesTax(countryCode<string>, stateCode<string?>, amount<number?>, taxNumber<string?>)<Promise<object>>`

**Notice: this method is origin-aware. It means it return values relative to your configured tax origin country.**

:estonia: **Given an Estonian customer without any VAT number, buying 100.00€ of goods** (eg. a consumer):

```javascript
SalesTax.getAmountWithSalesTax("EE", null, 100.00)
  .then((amountWithTax) => {
    // This customer has to pay 20% VAT
    /* amountWithTax ===
      {
        type     : "vat",
        rate     : 0.20,
        price    : 100.00,
        total    : 120.00,
        area     : "worldwide",
        exchange : "consumer",

        charge   : {
          direct  : true,
          reverse : false
        },

        details  : [
          {
            type   : "vat",
            rate   : 0.20,
            amount : 20.00
          }
        ]
      }
     */
  });
```

### :white_check_mark: Validate tax number for a customer

**Prototype:** `SalesTax.validateTaxNumber(countryCode<string>, taxNumber<string?>)<Promise<boolean>>`

:fr: **Given a French customer VAT number** (eg. here `SARL CRISP IM` with VAT number `FR 50833085806`):

```javascript
SalesTax.validateTaxNumber("FR", "FR50833085806")
  .then((isValid) => {
    // isValid === true
  });
```

:us: **Given an United States customer without any VAT number** (eg. a consumer):

```javascript
SalesTax.validateTaxNumber("US")
  .then((isValid) => {
    // isValid === false
  });
```

:latvia: **Given a Latvian customer without any VAT number** (eg. a consumer):

```javascript
SalesTax.validateTaxNumber("LV")
  .then((isValid) => {
    // isValid === false
  });
```

:es: **Given a Spanish customer who provided an invalid VAT number** (eg. a rogue business):

```javascript
SalesTax.validateTaxNumber("ES", "ESX12345523")
  .then((isValid) => {
    // isValid === false
  });
```

### :white_check_mark: Get tax exchange status for a customer (exempt + area + exchange)

**Prototype:** `SalesTax.getTaxExchangeStatus(countryCode<string>, stateCode<string?>, taxNumber<string?>)<Promise<object>>`

**Notice: this method is origin-aware. It means it return values relative to your configured tax origin country.**

:fr: **Given a French customer VAT number** (eg. here `SARL CRISP IM` with VAT number `FR 50833085806`):

```javascript
SalesTax.getTaxExchangeStatus("FR", null, "FR50833085806")
  .then((exchangeStatus) => {
    /* exchangeStatus ===
      {
        exchange : "business",
        area     : "worldwide",
        exempt   : true
      }
     */
  });
```

:morocco: **Given a Morocco-based customer**:

```javascript
SalesTax.getTaxExchangeStatus("MA")
  .then((exchangeStatus) => {
    /* exchangeStatus ===
      {
        exchange : "consumer",
        area     : "worldwide",
        exempt   : false
      }
     */
  });
```

:us: **Given an United States > Delaware-based customer**:

```javascript
SalesTax.getTaxExchangeStatus("US", "DE")
  .then((exchangeStatus) => {
    /* exchangeStatus ===
      {
        exchange : "consumer",
        area     : "worldwide",
        exempt   : true
      }
     */
  });
```

:hong_kong: **Given an Hong Kong-based customer**:

```javascript
SalesTax.getTaxExchangeStatus("HK")
  .then((exchangeStatus) => {
    /* exchangeStatus ===
      {
        exchange : "consumer",
        area     : "worldwide",
        exempt   : true
      }
     */
  });
```

### :white_check_mark: Disable / enable tax number validation

**Prototype:** `SalesTax.toggleEnabledTaxNumberValidation(enabled<boolean>)<undefined>`

:thumbsup: **Enable tax number validation** (enabled by default — use only if you disabled it previously):

```javascript
SalesTax.toggleEnabledTaxNumberValidation(true)
```

:thumbsdown: **Disable tax number validation** (do not check tax number syntax):

```javascript
SalesTax.toggleEnabledTaxNumberValidation(false)
```

### :white_check_mark: Disable / enable tax number fraud check

**Prototype:** `SalesTax.toggleEnabledTaxNumberFraudCheck(enabled<boolean>)<undefined>`

**Notice: fraud check requires tax number validation to be enabled.**

:thumbsup: **Enable tax number fraud check** (enable hitting against external APIs to verify tax numbers against fraud):

```javascript
SalesTax.toggleEnabledTaxNumberFraudCheck(true)
```

:thumbsdown: **Disable tax number fraud check** (disabled by default — use only if you enabled it previously):

```javascript
SalesTax.toggleEnabledTaxNumberFraudCheck(false)
```

## Where is the offline tax data is pulled from?

The offline tax data is pulled from [Value-added tax (VAT) rates — PwC](http://taxsummaries.pwc.com/ID/Value-added-tax-(VAT)-rates) (last updated: 24th May 2019).

**It is kept up-to-date year-by-year with tax changes worldwide.**

Some countries have multiple sales tax, eg. Brazil. In those cases, the returned sales tax is the one on services. Indeed, I consider most users of this module use it for their SaaS business — _in other words, service businesses._

## What happens if a country or state schedules a tax rate change?

As tax rate changes happen to some countries in the word on a yearly basis, `sales-tax` automatically uses the current tax rate relative to current date and time, ie. whenever you call the library functions.

At a technical level, tax rate changes for a country can be easily scheduled from the [tax rates JSON file](https://github.com/valeriansaliou/node-sales-tax/blob/master/res/sales_tax_rates.json) by moving the current tax rate in a `before` object, which then stores the country tax rate before enforcement date, and then the future tax rate is stored in the main object. Note that as a library user, you do not have to schedule tax rate changes, `sales-tax` handles it for you automatically.

Please make sure you always keep `sales-tax` up-to-date with the latest NPM version, as those tax rate changes are stored in an offline JSON file, which requires a manual library update.

_For instance, Germany changed their VAT rate from 19% down to 16% as of 1st July 2020:_

```json
"DE": {
  "type": "vat",
  "rate": 0.16,

  "before": {
    "2020-06-30T22:00:00.000Z": {
      "type": "vat",
      "rate": 0.19
    }
  }
}
```

## I bill from the EU, but sales tax is still being returned for non-EU countries!

As international tax rules can be **very complex** depending on your business legal structure (eg. if you run a nexus in an US state, you may owe sales tax to this US state, even if you charge from the UK); `sales-tax` does not void returned tax rate for `worldwide` countries.

Thus, when the country is `worldwide` relative to your billing origin country, you need to handle things your own way.

To make things easier for you, `sales-tax` returns an `area` parameter in the `SalesTax.getSalesTax`, that is either `worldwide`, `regional` or `national` (this depends on your configured origin country). For `regional` and `national` areas, you can trust the returned rate. However, you may need to override all `worldwide` area rates and void them all to zero; for instance if you charge from France to the United States, and you know that you do not owe sales tax in the US as you do not run a nexus company in the US.

⚠️ **Note that this would also apply to non-EU businesses charging customers outside of their jurisdiction.** For instance, an Australian business would not charge VAT for customers outside of the country, yet it would charge VAT for all Australian customers. Yet, VAT might be returned by `sales-tax` for such international charges (ie. `worldwide` area). Therefore, such a `worldwide` area VAT should be voided if you consider that this does not apply to you, while `national` or `regional` area VAT should be used as normal. Always check with your accountant when in doubt.

## How are tax numbers validated?

### :eu: Europe

European VAT numbers can be fraud-checked against the official `ec.europa.eu` VIES VAT API, which return whether a given VAT number exists or not. This helps you ensure a customer-provided VAT number really exists. This feature, as it may incur significant delays (while querying the VIES VAT API) is disabled by default. There's [a switch to enable it](#white_check_mark-disable--enable-tax-number-fraud-check).

In all cases, the syntax of the European VAT numbers get validated from offline rules. Although, it only checks number syntaxical correctness; thus it is not sufficient to tell if the number exists or not.

You can manually check a VAT number on [VIES VAT number validation](http://ec.europa.eu/taxation_customs/vies/vatRequest.html).

### :us: United States

United States EIN (U.S. Employer Identification Number) are validated against EIN format rules.

### :canada: Canada

Canada BN (Business Number) are validated against BN format rules.

### :black_flag: Rest of the world

If a country or economic community is not listed here, provided tax identification numbers are ignored for those countries (considered as invalid — so do not rely on validation methods as a source of truth).

_If you need tax number validation for a missing country, feel free to submit a Pull Request._
