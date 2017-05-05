/*
 * node-sales-tax
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var country_tax = require("../res/country_tax.json");


/**
 * SalesTax
 * @class
 * @classdesc  Instanciates a new sales tax object
 */
var SalesTax = function() {};


/**
 * SalesTax.prototype.hasSalesTax
 * @public
 * @param  {string}  countryCode
 * @return {boolean} Whether country has any sales tax
 */
SalesTax.prototype.hasSalesTax = function(
  countryCode
) {
  return country_tax[(countryCode || "").toUpperCase()] ? true : false;
};


/**
 * SalesTax.prototype.getSalesTax
 * @public
 * @param  {string} countryCode
 * @param  {string} [taxNumber]
 * @return {object} Sales tax (float from 0 to 1)
 */
SalesTax.prototype.getSalesTax = function(
  countryCode, taxNumber
) {
  taxNumber = (taxNumber || null);

  // Return sales tax for country, or default (if no known sales tax)
  return country_tax[(countryCode || "").toUpperCase()] || {
    type: "none",
    rate: 0.00,
    exempt: false
  };
};


/**
 * SalesTax.prototype.getAmountWithSalesTax
 * @public
 * @param  {string} countryCode
 * @param  {number} [amount]
 * @param  {string} [taxNumber]
 * @return {object} Amount with sales tax included
 */
SalesTax.prototype.getAmountWithSalesTax = function(
  countryCode, amount, taxNumber
) {
  amount = (amount || 0.00);
  taxNumber = (taxNumber || null);

  // TODO

  return amount;
};


/**
 * SalesTax.prototype.validateTaxNumber
 * @public
 * @param  {string}  taxNumber
 * @return {boolean} Whether tax number is valid or not
 */
SalesTax.prototype.validateTaxNumber = function(
  taxNumber
) {
  // TODO

  return true;
};


/**
 * SalesTax.prototype.isTaxExempt
 * @public
 * @param  {string}  taxNumber
 * @return {boolean} Whether tax number is tax-exempt or not
 */
SalesTax.prototype.isTaxExempt = function(
  taxNumber
) {
  // TODO

  return true;
};


module.exports = new SalesTax();
