# Changelog

## 2.5.0 (2021-12-31)

### Tax Rate Updates

* **The Bahamas**: 7.5% to 12% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Botswana**: 12% to 14% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Brazil**: 35% to 17% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **China**: 16% to 13% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Ecuador**: 14% to 12% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Kenya**: 14% to 16% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Lebanon**: 10% to 11% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Nigeria**: 5% to 7.5% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Pakistan**: 16% to 17% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Puerto Rico**: 10.5% to 11.5% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Saint Lucia**: 15% to 12.5% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].
* **Tunisia**: 18% to 19% [[@PhilosophicalPsycho](https://github.com/PhilosophicalPsycho), [#47](https://github.com/valeriansaliou/node-sales-tax/pull/47)].

## 2.4.0 (2021-11-23)

### Breaking Changes

* Drop support for NodeJS versions that do not support native `Promise`. This should not impact anyone anyway, because the `package.json` already restricts NodeJS version to `"node": ">= 6.4.0"`. All target NodeJS versions therefore have native `Promise` support [[@valeriansaliou](https://github.com/valeriansaliou), [1b7c53e](https://github.com/valeriansaliou/node-sales-tax/commit/1b7c53e423aea319a4928333c67fbbe2bbd308db)].

### Bug Fixes

* Fix broken EU VAT numbers fraud-checks due to changed Europa VAT APIs data schema (from `ec.europa.eu`) [[@valeriansaliou](https://github.com/valeriansaliou), [ec05b71](https://github.com/valeriansaliou/node-sales-tax/commit/ec05b71a780855c1997a89ebb54329a0265821e6), [#45](https://github.com/valeriansaliou/node-sales-tax/issues/45)].

## 2.3.0 (2021-04-20)

### Non-Breaking Changes

* **Great Britain**: GB VAT numbers are now fraud-checked against HMRC APIs [[@valeriansaliou](https://github.com/valeriansaliou), [b8352f8](https://github.com/valeriansaliou/node-sales-tax/commit/b8352f8ee389ed45bdbcafe6cbc40b18efef74e4), [#40](https://github.com/valeriansaliou/node-sales-tax/issues/40)].

## 2.2.6 (2021-02-12)

### Tax Rate Updates

* **Great Britain**: pulled out of the VAT MOSS scheme, as it is not a member of the European Union anymore as of 31st December 2020 [[@valeriansaliou](https://github.com/valeriansaliou), [#26](https://github.com/valeriansaliou/node-sales-tax/issues/26)].

## 2.2.5 (2020-11-16)

### Bug Fixes

* Fix an issue where a country sales tax that is cancelled by a negative regional tax would still result in the details object being populated with the exempted country tax (eg. a tax-exempt region in Spain like Gran Canaria), while this details object should have been empty [[@lfalck](https://github.com/lfalck), [#36](https://github.com/valeriansaliou/node-sales-tax/pull/36)].

## 2.2.4 (2020-10-27)

### Tax Rate Updates

* **India**: VAT has been moved to GST (now 18%) [[@valeriansaliou](https://github.com/valeriansaliou), [#31](https://github.com/valeriansaliou/node-sales-tax/issues/31)].

## 2.2.3 (2020-10-27)

### Tax Rate Fixes

* **Canada**: fix updated tax rates for some states, as calculation errors were introduced in `v2.2.2` due to the GST offset not being taken into account when HST is used [[@valeriansaliou](https://github.com/valeriansaliou), [57b0620](https://github.com/valeriansaliou/node-sales-tax/commit/57b0620817ea261e60a3a4e89d0f825aa8d6ff63)].

## 2.2.2 (2020-10-21)

### Tax Rate Updates

* **Canada**: tax rates have been updated for some states [[@stephankaag](https://github.com/stephankaag), [#32](https://github.com/valeriansaliou/node-sales-tax/pull/32)].

## 2.2.1 (2020-09-01)

### Tax Rate Updates

* **Ireland**: 23% to 21% (1st September 2020 to 28th February 2021) [[@gierschv](https://github.com/gierschv)].

## 2.2.0 (2020-06-12)

### Non-Breaking Changes

* Return a detailed view of all sub-tax rates used when calling `getSalesTax()` and `getAmountWithSalesTax()` (this is useful eg. for Canada, which has multiple tax rates ie. state and country taxes) [[@maktouch](https://github.com/maktouch), [@valeriansaliou](https://github.com/valeriansaliou), [6e5b9be](https://github.com/valeriansaliou/node-sales-tax/commit/6e5b9be2df632ca6e4b97286a690529fffae3b98), [#27](https://github.com/valeriansaliou/node-sales-tax/pull/27)].

## 2.1.0 (2020-06-11)

### Non-Breaking Changes

* Add a way to schedule tax rate updates for a country or state in a future date [[@valeriansaliou](https://github.com/valeriansaliou), [accda53](https://github.com/valeriansaliou/node-sales-tax/commit/accda53ce1d89ac48f2a1c77d9a58b04d143cc36)].

### Tax Rate Updates

* **Germany**: 19% to 16% (1st July 2020 to 31st December 2020) [[@valeriansaliou](https://github.com/valeriansaliou)].
* **Kenya**: 16% to 14% (1st April 2020) [[@adrai](https://github.com/adrai)].
* **Saudi Arabia**: 5% to 15% (1st July 2020) [[@adrai](https://github.com/adrai)].

## 2.0.0 (2017-10-27)

### New Features

* More methods added [[@valeriansaliou](https://github.com/valeriansaliou)].

## 1.0.0 (2017-05-05)

### New Features

* Initial release [[@valeriansaliou](https://github.com/valeriansaliou)].
