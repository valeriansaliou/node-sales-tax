# node-sales-tax

[![Build Status](https://img.shields.io/travis/valeriansaliou/node-sales-tax/master.svg)](https://travis-ci.org/valeriansaliou/node-sales-tax) [![Test Coverage](https://img.shields.io/coveralls/valeriansaliou/node-sales-tax/master.svg)](https://coveralls.io/github/valeriansaliou/node-sales-tax?branch=master) [![NPM](https://img.shields.io/npm/v/sales-tax.svg)](https://www.npmjs.com/package/sales-tax) [![Downloads](https://img.shields.io/npm/dt/sales-tax.svg)](https://www.npmjs.com/package/sales-tax)

International sales tax calculator for Node (offline, no dependency on an external API). Kept up-to-date.

## Who uses it?

<table>
<tr>
<td align="center"><a href="https://crisp.im/"><img src="https://valeriansaliou.github.io/node-sales-tax/images/crisp.png" height="64" /></a></td>
</tr>
<tr>
<td align="center">Crisp</td>
</tr>
</table>

_👋 You use sales-tax and you want to be listed there? Contact me!_

## How to install?

Include `sales-tax` in your `package.json` dependencies.

Alternatively, you can run `npm install sales-tax --save`.

## How to use?

`TODO`

## Where the tax data is pulled from?

The tax data is pulled from [http://www.ey.com/gl/en/services/tax/worldwide-vat--gst-and-sales-tax-guide---rates](VAT, GST and sales tax rates — ey.com).

It is kept up-to-date with the year-by-year tax changes worldwide.

Some countries have multiple sales tax, eg. Brazil. In those cases, the returned sales tax is the one on services. Indeed, I consider most users of this module use it for their SaaS business — in other words, service businesses.
