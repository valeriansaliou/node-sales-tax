Changelog
=========

## 2.18.0 (2025-01-06)

### Tax Rate Updates

* **Israel**: 17% to 18% (1st January 2025) [[@valeriansaliou](https://github.com/valeriansaliou), [46d696d](https://github.com/valeriansaliou/node-sales-tax/commit/46d696d1ed2da701cac049c23c9bf2e51db1b1f7)].

## 2.17.0 (2025-01-01)

### Tax Rate Updates

* **Slovakia**: 20% to 23% (1st January 2025) [[@valeriansaliou](https://github.com/valeriansaliou), [f141689](https://github.com/valeriansaliou/node-sales-tax/commit/f141689fea598f199b0c7a6318cc6aa970d8ff75)].
* Add tax entries for: Andorra [[@Kikobeats](https://github.com/Kikobeats), [#74](https://github.com/valeriansaliou/node-sales-tax/pull/74)].

## 2.16.0 (2024-09-18)

### Bug Fixes

* Switched from `node-fetch` to `cross-fetch` to address an incompatible dependency issue starting in NodeJS 22 [[@mlecoq](https://github.com/mlecoq), [#67](https://github.com/valeriansaliou/node-sales-tax/pull/67)].

## 2.15.0 (2024-09-02)

### Tax Rate Updates

* **Finland**: 24% to 25.5% (1st September 2024) [[@brennofaneco](https://github.com/brennofaneco), [#69](https://github.com/valeriansaliou/node-sales-tax/pull/69)].

## 2.14.0 (2024-02-16)

### Tax Rate Updates

* **Japan**: 8% to 10% [[@intarsz](https://github.com/intarsz), [#65](https://github.com/valeriansaliou/node-sales-tax/pull/65)].
* **Turkey**: 18% to 20% [[@intarsz](https://github.com/intarsz), [#65](https://github.com/valeriansaliou/node-sales-tax/pull/65)].

## 2.13.1 (2024-02-12)

### Bug Fixes

* Fix broken EU VAT numbers fraud-checks for certain countries, where the official country code does not match the Eurostat country code (eg. Greece) [[@intarsz](https://github.com/intarsz), [#64](https://github.com/valeriansaliou/node-sales-tax/pull/64)].

## 2.13.0 (2024-02-05)

### Tax Rate Updates

* **Estonia**: 20% to 22% (1st January 2024) [[@DanielRaouf](https://github.com/DanielRaouf), [#63](https://github.com/valeriansaliou/node-sales-tax/pull/63)].

## 2.12.0 (2023-08-12)

### New Features

* Return a `currency` attribute in all sales tax response objects [[@mindflowgo](https://github.com/mindflowgo), [#61](https://github.com/valeriansaliou/node-sales-tax/pull/61)].

### Non-Breaking Changes

* Replace deprecated `request` dependency with `node-fetch` [[@wootra](https://github.com/wootra), [#53](https://github.com/valeriansaliou/node-sales-tax/pull/53)].

### Tax Rate Updates

* Add tax entries for: Bosnia, Ukraine and Eritrea [[@mindflowgo](https://github.com/mindflowgo), [#61](https://github.com/valeriansaliou/node-sales-tax/pull/61)].

## 2.11.0 (2023-06-27)

### Tax Rate Updates

* **Ghana**: 12.5% to 15% (1st January 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [5c8f0b1](https://github.com/valeriansaliou/node-sales-tax/commit/5c8f0b1bdbade8d6830cf35cde3f5d631dad214a)].

## 2.10.0 (2023-05-30)

### Tax Rate Updates

* **Luxembourg**: 17% to 16% (1st January 2023 to 31st December 2023) [[@pszxzsd](https://github.com/pszxzsd), [#56](https://github.com/valeriansaliou/node-sales-tax/pull/56)].

## 2.9.0 (2023-03-03)

### New Features

* Add TypeScript type definitions [[@valeriansaliou](https://github.com/valeriansaliou), [0f5f245](https://github.com/valeriansaliou/node-sales-tax/commit/0f5f245d89ce1afd633931ad0ad092d1bcebcfaf)].

## 2.8.0 (2023-03-02)

### Tax Rate Updates

* **Switzerland**: 7.7% to 8.1% (1st January 2024) [[@adrai](https://github.com/adrai), [#55](https://github.com/valeriansaliou/node-sales-tax/pull/55)].

## 2.7.1 (2023-01-09)

### New Features

* Automate the package release process via GitHub Actions (ie. `npm publish`) [[@valeriansaliou](https://github.com/valeriansaliou), [73b8247](https://github.com/valeriansaliou/node-sales-tax/commit/73b8247d5dfd350c54ed576297dafa20c15b7fa3)].

## 2.7.0 (2022-10-21)

### Non-Breaking Changes

* Update the `jsvat` offline VAT number format validator to its latest version [[@valeriansaliou](https://github.com/valeriansaliou), [403b38e](https://github.com/valeriansaliou/node-sales-tax/commit/403b38e7edc7b5db76a9b2c237d8e8601bc3206f)].

### Bug Fixes

* Fix broken EU VAT numbers fraud-checks due to (_once again_) changed Europa VAT APIs data schema (from `ec.europa.eu`) [[@valeriansaliou](https://github.com/valeriansaliou), [403b38e](https://github.com/valeriansaliou/node-sales-tax/commit/403b38e7edc7b5db76a9b2c237d8e8601bc3206f)].

## 2.6.0 (2022-08-19)

### Tax Rate Updates

* **New Mexico, United States**: 5.125% to 5% [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Botswana**: 14% to 12% (1st August 2022 to 1st February 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Anguilla**: 13% GST [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Aruba**: 12.5% VAT (1st January 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Indonesia**: 10% to 11% [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Sri Lanka**: 12% VAT [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Maldives**: 6% to 8% (1st January 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Singapore**: 7% to 8% (1st January 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Singapore**: 8% to 9% (1st January 2024) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Suriname**: 10% to 15% (1st January 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Uzbekistan**: 15% to 12% (1st January 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].
* **Thailand**: 7% to 10% (1st September 2023) [[@valeriansaliou](https://github.com/valeriansaliou), [701781c](https://github.com/valeriansaliou/node-sales-tax/commit/701781c0843799948077e8f112807b2bfc41431e)].

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
