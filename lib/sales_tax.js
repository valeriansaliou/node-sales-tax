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

var request = require("request");
var check_fraud_eu_vat = require("validate-vat");
var validate_eu_vat = require("jsvat");
var validate_us_vat = require("ein-validator");

var regex_whitespace = /\s/g;
var regex_eu_vat = /^[A-Z]{2}(.+)$/;
var regex_gb_vat = /^GB([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})$/;
var regex_ca_vat = /^[0-9]{9}$/;

var validate_gb_vat_url = (
  "https://api.service.hmrc.gov.uk/organisations/vat/check-vat-number/lookup"
);
var validate_gb_vat_options = {
  timeout : 20000
};

var tax_rates = require("../res/sales_tax_rates.json");
var region_countries = require("../res/region_countries.json");

var tax_default_object = {
  type : "none",
  rate : 0.00
};


/**
 * SalesTax
 * @class
 * @classdesc  Instanciates a new sales tax object
 */
var SalesTax = function() {
  this.taxOriginCountry = null;
  this.useRegionalTax = true;
  this.enabledTaxNumberValidation = true;
  this.enabledTaxNumberFraudCheck = false;
};


/**
 * SalesTax.prototype.hasSalesTax
 * @public
 * @param  {string}  countryCode
 * @return {boolean} Whether country has sales tax
 */
SalesTax.prototype.hasSalesTax = function(
  countryCode
) {
  countryCode = (countryCode || "").toUpperCase();

  return (
    (((this.__readCurrentTaxRates(countryCode) || {}).rate || 0.00) > 0) ?
      true : false
  );
};


/**
 * SalesTax.prototype.hasStateSalesTax
 * @public
 * @param  {string}  countryCode
 * @param  {string}  stateCode
 * @return {boolean} Whether country state has sales tax
 */
SalesTax.prototype.hasStateSalesTax = function(
  countryCode, stateCode
) {
  countryCode = (countryCode || "").toUpperCase();
  stateCode = (stateCode || "").toUpperCase();

  var stateTax = (
    ((this.__readCurrentTaxRates(countryCode) || {}).states || {})[stateCode]
  );

  return (
    (((stateTax || {}).rate || 0.00) > 0) ? true : false
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

  // Acquire target tax area
  var targetArea = self.__getTargetArea(countryCode);

  // Acquire sales tax for country, or default (if no known sales tax)
  // Notice: if regional tax is ignored, force national tax \
  //   (eg. EU w/o VAT MOSS)
  var countryTax, stateTax;

  if (targetArea === "regional" && this.useRegionalTax === false &&
        this.taxOriginCountry !== null) {
    countryTax = (
      this.__readCurrentTaxRates(this.taxOriginCountry) || tax_default_object
    );

    stateTax = tax_default_object;
  } else {
    countryTax = (
      this.__readCurrentTaxRates(countryCode) || tax_default_object
    );

    stateTax = ((countryTax.states || {})[stateCode] || tax_default_object);
  }

  if (countryTax.rate > 0 || stateTax.rate > 0) {
    return self.getTaxExchangeStatus(countryCode, stateCode, taxNumber)
      .then(function(exchangeStatus) {
        return __Promise.resolve(
          self.__buildSalesTaxContext(countryTax, stateTax, exchangeStatus)
        );
      });
  }

  return __Promise.resolve(
    self.__buildSalesTaxContext(countryTax, stateTax)
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

  countryCode = (countryCode || "").toUpperCase();
  stateCode = (stateCode || "").toUpperCase();
  amount = (amount || 0.00);
  taxNumber = (taxNumber || null);

  // Acquire sales tax, then process amount.
  return self.getSalesTax(countryCode, stateCode, taxNumber)
    .then(function(tax) {
      // Generate amount details (list of all sub-amounts from each sub-tax \
      //   rate)
      var amountDetails = [];

      for (var i = 0; i < tax.details.length; i++) {
        amountDetails.push({
          type   : tax.details[i].type,
          rate   : tax.details[i].rate,
          amount : tax.details[i].rate * amount
        });
      }

      // Return total amount with sales tax
      return __Promise.resolve({
        type     : tax.type,
        rate     : tax.rate,
        price    : amount,
        total    : (1.00 + tax.rate) * amount,
        area     : tax.area,
        exchange : tax.exchange,
        charge   : tax.charge,
        details  : amountDetails
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
  var self = this;

  countryCode = (countryCode || "").toUpperCase();

  if (self.enabledTaxNumberValidation === true) {
    // Normalize tax number (eg. remove spaces)
    var cleanTaxNumber = (taxNumber || "").replace(regex_whitespace, "");

    if (cleanTaxNumber) {
      // United States
      if (countryCode === "US") {
        // Validate US EIN
        return __Promise.resolve(
          validate_us_vat.isValid(cleanTaxNumber) && true
        );
      }

      // Canada
      if (countryCode === "CA") {
        // Validate CA BN
        return __Promise.resolve(
          regex_ca_vat.test(cleanTaxNumber) && true
        );
      }

      // United Kingdom
      if (countryCode === "GB") {
        return new __Promise(function(resolve, reject) {
          // Validate GB VAT number
          var splitMatch = cleanTaxNumber.match(regex_gb_vat);
          var isValid = ((splitMatch && splitMatch[1]) ? true : false);

          // Check number for fraud? (online check)
          if (isValid === true && self.enabledTaxNumberFraudCheck === true) {
            // Query UK HMRC validation API
            request.get(
              (validate_gb_vat_url + "/" + splitMatch[1]),
              validate_gb_vat_options,

              function(error, response) {
                if (error) {
                  return reject(error);
                }

                return resolve(
                  (response.statusCode >= 200 && response.statusCode <= 299) ?
                    true : false
                );
              }
            );
          } else {
            return resolve(isValid);
          }
        });
      }

      // European Union member states (sourced from dynamic list)
      if ((region_countries.EU || []).indexOf(countryCode) !== -1) {
        return new __Promise(function(resolve, reject) {
          // Validate EU VAT number
          var validationInfo = validate_eu_vat.checkVAT(cleanTaxNumber);
          var isValid = (validationInfo.isValid && true);

          // No country match?
          if (isValid === true &&
                ((validationInfo.country || {}).isoCode || {}).short !==
                  countryCode) {
            isValid = false;
          }

          // Check number for fraud? (online check)
          if (isValid === true && self.enabledTaxNumberFraudCheck === true) {
            // Split VAT number (n extract actual VAT number)
            var splitMatch = cleanTaxNumber.match(regex_eu_vat);

            // Check fraud on EU VAT number?
            if (splitMatch && splitMatch[1]) {
              check_fraud_eu_vat(
                countryCode, splitMatch[1],

                function(error, fraudInfo) {
                  if (error) {
                    return reject(error);
                  }

                  // Return whether valid or not
                  return resolve(fraudInfo.valid && true);
                }
              );
            } else {
              return resolve(false);
            }
          } else {
            return resolve(isValid);
          }
        });
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
 * SalesTax.prototype.getTaxExchangeStatus
 * @public
 * @param  {string} countryCode
 * @param  {string} [stateCode]
 * @param  {string} [taxNumber]
 * @return {object} Promise object (returns an exchange status object)
 */
SalesTax.prototype.getTaxExchangeStatus = function(
  countryCode, stateCode, taxNumber
) {
  var self = this;

  countryCode = (countryCode || "").toUpperCase();
  stateCode = ((stateCode || "").toUpperCase() || null);
  taxNumber = (taxNumber || null);

  var targetArea = self.__getTargetArea(countryCode);

  // Country or state (if any) has any sales tax?
  if (self.__hasTotalSalesTax(countryCode, stateCode) === true) {
    // Check for tax-exempt status? (if tax number is provided)
    if (taxNumber) {
      return self.validateTaxNumber(countryCode, taxNumber)
        .then(function(isValid) {
          // Consider valid numbers as tax-exempt (overrides exempt status if \
          //   area is national)
          if (isValid === true) {
            return __Promise.resolve({
              exchange : "business",
              area     : targetArea,
              exempt   : (targetArea !== "national" && true)
            });
          }

          return __Promise.resolve({
            exchange : "consumer",
            area     : targetArea,
            exempt   : false
          });
        });
    }

    // Consider as non tax-exempt
    return __Promise.resolve({
      exchange : "consumer",
      area     : targetArea,
      exempt   : false
    });
  }

  // Consider as tax-exempt (country has no sales tax)
  return __Promise.resolve({
    exchange : "consumer",
    area     : targetArea,
    exempt   : true
  });
};


/**
 * SalesTax.prototype.setTaxOriginCountry
 * @public
 * @param  {string} countryCode
 * @return {undefined}
 */
SalesTax.prototype.setTaxOriginCountry = function(
  countryCode, useRegionalTax
) {
  this.taxOriginCountry = ((countryCode || "").toUpperCase() || null);

  if (typeof useRegionalTax === "boolean") {
    this.useRegionalTax = useRegionalTax;
  }
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
 * SalesTax.prototype.toggleEnabledTaxNumberFraudCheck
 * @public
 * @param  {boolean} enabled
 * @return {undefined}
 */
SalesTax.prototype.toggleEnabledTaxNumberFraudCheck = function(
  enabled
) {
  this.enabledTaxNumberFraudCheck = (enabled && true);
};


/**
 * SalesTax.prototype.__getTargetArea
 * @private
 * @param  {string} countryCode
 * @return {string} Target area
 */
SalesTax.prototype.__getTargetArea = function(
  countryCode
) {
  // Default to worldwide
  var targetArea = "worldwide";

  if (this.taxOriginCountry !== null) {
    if (this.taxOriginCountry === countryCode) {
      // Same country (national)
      targetArea = "national";
    } else {
      // Same economic community? (regional)
      for (var region in region_countries) {
        var regionCountries = region_countries[region];

        if (regionCountries.indexOf(this.taxOriginCountry) !== -1 &&
              regionCountries.indexOf(countryCode) !== -1) {
          targetArea = "regional";

          break;
        }
      }
    }
  }

  return targetArea;
};


/**
 * SalesTax.prototype.__buildSalesTaxContext
 * @private
 * @param  {object} countryTax
 * @param  {object} stateTax
 * @param  {object} [exchangeStatus]
 * @return {object} Sales tax context object
 */
SalesTax.prototype.__buildSalesTaxContext = function(
  countryTax, stateTax, exchangeStatus
) {
  // Acquire exchange + exempt + area
  var taxExchange = ((exchangeStatus || {}).exchange || "consumer");
  var taxArea = ((exchangeStatus || {}).area || "worldwide");
  var isExempt = ((exchangeStatus || {}).exempt || false);
  var fullRate = (countryTax.rate + stateTax.rate);

  // Generate tax type (multiple sales tax may apply, eg. country + state)
  var type = countryTax.type;

  if (stateTax.rate > 0) {
    if (countryTax.rate > 0) {
      type = type + "+" + stateTax.type;
    } else {
      type = stateTax.type;
    }
  }

  // Build charge object
  var taxCharge = {};

  if (type !== "none") {
    taxCharge.direct = !isExempt;
    taxCharge.reverse = (isExempt && fullRate > 0 && true);
  } else {
    taxCharge.direct = false;
    taxCharge.reverse = false;
  }

  // Build details object (list of all sub-taxes that make up the total rate)
  var taxDetails = [];

  if (isExempt !== true) {
    if (countryTax.rate > 0) {
      taxDetails.push({
        type : countryTax.type,
        rate : countryTax.rate
      });
    }
    if (stateTax.rate > 0) {
      taxDetails.push({
        type : stateTax.type,
        rate : stateTax.rate
      });
    }
  }

  // Build sales tax context
  return {
    type     : type,
    rate     : (isExempt === true) ? 0.00 : fullRate,
    area     : taxArea,
    exchange : taxExchange,
    charge   : taxCharge,
    details  : taxDetails
  };
};


/**
 * SalesTax.prototype.__readCurrentTaxRates
 * @private
 * @param  {object} countryCode
 * @return {object} Current tax rates
 */
SalesTax.prototype.__readCurrentTaxRates = function(
  countryCode
) {
  var countryTaxRates = tax_rates[countryCode];

  // Check tax rates before date? (if any defined)
  if (typeof (countryTaxRates || {}).before === "object") {
    var nowDate = this.__getCurrentDate();

    var lowestBeforeDateString = null;
    var lowestBeforeDate = null;

    for (var beforeDateString in countryTaxRates.before) {
      // Parse date string to an actual date object
      // Notice: the date string uses an UTC+00:00 timezone, which gets parsed \
      //   into the runtime-local timezone, and compared against current date.
      var beforeDate = (new Date(beforeDateString));

      // Date is invalid? Throw an error, as we need to be clear that the \
      //   tax rates object is invalid.
      if (isNaN(beforeDate.getTime()) === true) {
        throw new Error("Invalid 'before' date string: " + beforeDateString);
      }

      // Are we still in the past relative to this country sales tax \
      //   rates? Then, pickup this tax rate (until we get past-date, and \
      //   then we can use the latest/master tax rate)
      if (nowDate < beforeDate) {
        // New lowest before date? (or none previously-defined)
        // Notice: pick the lowest found before date, as multiple 'before' \
        //   dates can be defined as to schedule multiple tax rate changes in \
        //   the future. Thus, we do not want to pick the first 'before' match.
        if (lowestBeforeDate === null || beforeDate < lowestBeforeDate) {
          lowestBeforeDate = beforeDate;
          lowestBeforeDateString = beforeDateString;
        }
      }
    }

    if (lowestBeforeDateString !== null) {
      return countryTaxRates.before[lowestBeforeDateString];
    }
  }

  return countryTaxRates;
};


/**
 * SalesTax.prototype.__hasTotalSalesTax
 * @private
 * @param  {string}  countryCode
 * @param  {string}  stateCode
 * @return {boolean} Whether country and state added result in a tax or not
 */
SalesTax.prototype.__hasTotalSalesTax = function(
  countryCode, stateCode
) {
  countryCode = (countryCode || "").toUpperCase();
  stateCode = (stateCode || "").toUpperCase();

  var taxRates = (this.__readCurrentTaxRates(countryCode) || {});

  var countryTax = (taxRates.rate || 0.00);
  var stateTax = 0.0;

  if (stateCode) {
    stateTax = (((taxRates.states || {})[stateCode] || {}).rate || 0.00);
  }

  return (
    ((countryTax + stateTax) > 0) ? true : false
  );
};


/**
 * SalesTax.prototype.__getCurrentDate
 * @private
 * @return {object} Current date
 */
SalesTax.prototype.__getCurrentDate = function() {
  // Return current date
  // Notice: this function is useless as-is, though it comes handy when \
  //   unit-testing the library, as it lets us override current date with \
  //   an hardcoded date, eg. to test the automated sales tax change feature.
  return (new Date());
};


module.exports = new SalesTax();
