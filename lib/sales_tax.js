/*
 * node-sales-tax
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var __Promise = (
  (typeof Promise !== "undefined") ?
    Promise : require("es6-promise-polyfill").Promise
);

var validate_eu_vat = require("validate-vat");
var country_tax = require("../res/country_tax.json");


/**
 * SalesTax
 * @class
 * @classdesc  Instanciates a new sales tax object
 */
var SalesTax = function() {
  this.enabledTaxNumberValidation = true;
};


/**
 * SalesTax.prototype.hasSalesTax
 * @public
 * @param  {string}  countryCode
 * @return {boolean} Whether country has any sales tax
 */
SalesTax.prototype.hasSalesTax = function(
  countryCode
) {
  countryCode = (countryCode || "").toUpperCase();

  return country_tax[countryCode] ? true : false;
};


/**
 * SalesTax.prototype.hasStateSalesTax
 * @public
 * @param  {string}  countryCode
 * @param  {string}  stateCode
 * @return {boolean} Whether country state has any sales tax
 */
SalesTax.prototype.hasStateSalesTax = function(
  countryCode, stateCode
) {
  countryCode = (countryCode || "").toUpperCase();
  stateCode = (stateCode || "").toUpperCase();

  return (
    ((country_tax[countryCode] || {}).states || {})[stateCode] ? true : false
  );
};


/**
 * SalesTax.prototype.getSalesTax
 * @public
 * @param  {string} countryCode
 * @param  {string} [stateCode]
 * @param  {string} [taxNumber]
 * @return {object} Promise object (returns the sales tax from 0 to 1)
 */
SalesTax.prototype.getSalesTax = function(
  countryCode, stateCode, taxNumber
) {
  var self = this;

  countryCode = (countryCode || "").toUpperCase();
  stateCode = (stateCode || "").toUpperCase();
  taxNumber = (taxNumber || null);

  // Acquire sales tax for country, or default (if no known sales tax)
  var countryTax = country_tax[countryCode] || {
    type : "none",
    rate : 0.00
  };
  var stateTax = (countryTax.states || {})[stateCode] || {
    type : "none",
    rate : 0.00
  };

  if (countryTax.rate > 0 || stateTax.rate > 0) {
    return self.isTaxExempt(countryCode, taxNumber)
      .then(function(isExempt) {
        return __Promise.resolve(
          self.__buildSalesTaxContext(countryTax, stateTax, isExempt)
        );
      });
  }

  return __Promise.resolve(
    self.__buildSalesTaxContext(countryTax, stateTax, true)
  );
};


/**
 * SalesTax.prototype.getAmountWithSalesTax
 * @public
 * @param  {string} countryCode
 * @param  {string} [stateCode]
 * @param  {number} [amount]
 * @param  {string} [taxNumber]
 * @return {object} Promise object (returns the total tax amount)
 */
SalesTax.prototype.getAmountWithSalesTax = function(
  countryCode, stateCode, amount, taxNumber
) {
  var self = this;

  amount = (amount || 0.00);
  taxNumber = (taxNumber || null);

  // Acquire sales tax, then process amount.
  return self.getSalesTax(countryCode, stateCode, taxNumber)
    .then(function(tax) {
      return __Promise.resolve({
        type   : tax.type,
        rate   : tax.rate,
        exempt : tax.exempt,
        price  : amount,
        total  : (1.00 + tax.rate) * amount
      });
    });
};


/**
 * SalesTax.prototype.validateTaxNumber
 * @public
 * @param  {string} countryCode
 * @param  {string} taxNumber
 * @return {object} Promise object (returns a boolean for validity)
 */
SalesTax.prototype.validateTaxNumber = function(
  countryCode, taxNumber
) {
  if (this.enabledTaxNumberValidation === true) {
    if (taxNumber) {
      switch (countryCode) {
        // Europe member states
        case "AT":
        case "BE":
        case "BG":
        case "HR":
        case "CY":
        case "CZ":
        case "DK":
        case "EE":
        case "FI":
        case "FR":
        case "DE":
        case "EL":
        case "HU":
        case "IE":
        case "IT":
        case "LV":
        case "LT":
        case "LU":
        case "MT":
        case "NL":
        case "PL":
        case "PT":
        case "RO":
        case "SK":
        case "SI":
        case "ES":
        case "SE":
        case "GB": {
          return new __Promise(function(resolve, reject) {
            // Validate EU VAT number
            validate_eu_vat(
              countryCode, taxNumber,

              function(error, validationInfo) {
                if (error) {
                  return reject(error);
                }

                // Return whether valid or not
                return resolve(validationInfo.valid && true);
              }
            );
          });
        }
      }
    }

    // Consider as invalid tax number (tax number country not recognized, \
    //   or no tax number provided)
    return __Promise.resolve(false);
  }

  // Consider all tax numbers as valid
  return __Promise.resolve(true);
};


/**
 * SalesTax.prototype.isTaxExempt
 * @public
 * @param  {string} countryCode
 * @param  {string} taxNumber
 * @return {object} Promise object (returns a boolean for exempt status)
 */
SalesTax.prototype.isTaxExempt = function(
  countryCode, taxNumber
) {
  var self = this;

  // Country has any sales tax?
  if (self.hasSalesTax(countryCode) === true) {
    // Check for tax-exempt status? (if tax number is provided)
    if (taxNumber) {
      return self.validateTaxNumber(countryCode, taxNumber)
        .then(function(isValid) {
          // Consider valid numbers as tax-exempt
          if (isValid === true) {
            return __Promise.resolve(true);
          }

          return __Promise.resolve(false);
        });
    }

    // Consider as non tax-exempt
    return __Promise.resolve(false);
  }

  // Consider as tax-exempt (country has no sales tax)
  return __Promise.resolve(true);
};


/**
 * SalesTax.prototype.toggleEnabledTaxNumberValidation
 * @public
 * @param  {boolean} enabled
 * @return {undefined}
 */
SalesTax.prototype.toggleEnabledTaxNumberValidation = function(
  enabled
) {
  this.enabledTaxNumberValidation = (enabled && true);
};


/**
 * SalesTax.prototype.__buildSalesTaxContext
 * @private
 * @param  {object}  countryTax
 * @param  {object}  stateTax
 * @param  {boolean} isExempt
 * @return {object}  Sales tax context object
 */
SalesTax.prototype.__buildSalesTaxContext = function(
  countryTax, stateTax, isExempt
) {
  // Generate tax type (multiple sales tax may apply, eg. country + state)
  let _type = "none";

  if (countryTax.rate > 0 && stateTax.rate > 0) {
    _type = (countryTax.type + "+" + stateTax.type);
  } else if (stateTax.rate > 0) {
    _type = stateTax.type;
  } else if (countryTax.rate > 0) {
    _type = countryTax.type;
  }

  // Build sales tax context
  return {
    type   : _type,
    rate   : (isExempt === true) ? 0.00 : (countryTax.rate + stateTax.rate),
    exempt : isExempt
  };
};


module.exports = new SalesTax();
