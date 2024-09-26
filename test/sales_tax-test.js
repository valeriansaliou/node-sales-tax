/*
 * node-sales-tax
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var SalesTax = require("../");
var assert = require("assert");


describe("node-sales-tax", function() {
  // Acquire references to monkey-patched methods
  var methodReferences = {
    getCurrentDate : SalesTax.__getCurrentDate
  };

  // Reset library before each pass
  beforeEach(function() {
    // Ensure tax number validation is enabled before each pass
    SalesTax.setTaxOriginCountry(null, true);
    SalesTax.toggleEnabledTaxNumberValidation(true);
    SalesTax.toggleEnabledTaxNumberFraudCheck(true);

    // Restore monkey-patched methods before each pass
    SalesTax.__getCurrentDate = methodReferences.getCurrentDate;
  });

  describe("hasSalesTax", function() {
    it("🏳 should fail checking for a non-existing country", function() {
      assert.ok(
        !SalesTax.hasSalesTax("DONT_EXIST"), "Country should not have sales tax"
      );
    });

    it("🇭🇰 should fail checking for Hong Kong", function() {
      assert.ok(
        !SalesTax.hasSalesTax("HK"), "Country should not have sales tax"
      );
    });

    it("🇲🇦 should succeed checking for Morocco", function() {
      assert.ok(
        SalesTax.hasSalesTax("MA"), "Country should have sales tax"
      );
    });

    it("🇫🇷 should succeed checking for France (lower-case code)", function() {
      assert.ok(
        SalesTax.hasSalesTax("fr"), "Country should have sales tax"
      );
    });

    it("🇫🇷 should succeed checking for France (upper-case code)", function() {
      assert.ok(
        SalesTax.hasSalesTax("FR"), "Country should have sales tax"
      );
    });
  });

  describe("hasStateSalesTax", function() {
    it("🏳 should fail checking for a non-existing state", function() {
      assert.ok(
        !SalesTax.hasStateSalesTax("CA", "DONT_EXIST"), "State should not have sales tax"
      );
    });

    it("🇨🇦 should fail checking for Canada > Yukon", function() {
      assert.ok(
        !SalesTax.hasStateSalesTax("CA", "YT"), "State should not have sales tax"
      );
    });

    it("🇺🇸 should fail checking for United States > Delaware", function() {
      assert.ok(
        !SalesTax.hasStateSalesTax("US", "DE"), "State should not have sales tax"
      );
    });

    it("🇨🇦 should succeed checking for Canada > Quebec", function() {
      assert.ok(
        SalesTax.hasStateSalesTax("CA", "QC"), "State should have sales tax"
      );
    });

    it("🇺🇸 should succeed checking for United States > California", function() {
      assert.ok(
        SalesTax.hasStateSalesTax("US", "CA"), "State should have sales tax"
      );
    });
  });

  describe("getSalesTax", function() {
    it("🏳 should fail acquiring a non-existing country sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("DONT_EXIST")
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, null, "Currency should be empty"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇭🇰 should fail acquiring Hong Kong sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("HK")
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, null, "Currency should be empty"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇲🇦 should succeed acquiring Morocco sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("MA")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );
          
          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.currency, "MAD", "Currency should be MAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax (lower-case code) [no tax origin]", function() {
      return SalesTax.getSalesTax("fr")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax (upper-case code) [no tax origin]", function() {
      return SalesTax.getSalesTax("FR")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax with an invalid tax number [no tax origin]", function() {
      return SalesTax.getSalesTax("FR", null, "INVALID_TAX_NUMBER")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax with a tax-exempt tax number [French tax origin]", function() {
      SalesTax.setTaxOriginCountry("FR");

      return SalesTax.getSalesTax("FR", null, "FR50833085806")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20% (national market)"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "national", "Tax area should be NATIONAL"
          );

          assert.equal(
            tax.exchange, "business", "Tax exchange should be BUSINESS"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax with a tax-exempt tax number [no tax origin]", function() {
      return SalesTax.getSalesTax("FR", null, "FR50833085806")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0% (tax-exempt)"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "business", "Tax exchange should be BUSINESS"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, true, "Should perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax with a tax-exempt tax number [Spanish tax origin]", function() {
      SalesTax.setTaxOriginCountry("ES");

      return SalesTax.getSalesTax("FR", null, "FR50833085806")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0% (reverse charge on regional market)"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "business", "Tax exchange should be BUSINESS"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, true, "Should perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax with no regional tax [Spanish tax origin]", function() {
      SalesTax.setTaxOriginCountry("ES", false);

      return SalesTax.getSalesTax("FR")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.21, "Tax rate should be 21% (no regional tax, use national tax)"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.21, "Tax details #1 rate should be 21%"
          );
        });
    });

    it("🇫🇷 should succeed acquiring France sales tax with a tax-exempt tax number and no regional tax [Hungary tax origin]", function() {
      SalesTax.setTaxOriginCountry("HR", false);

      return SalesTax.getSalesTax("FR", null, "FR50833085806")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );
          
          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "business", "Tax exchange should be BUSINESS"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, true, "Should perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇪🇪 should succeed acquiring Estonia sales tax with no regional tax [Estonia tax origin]", function() {
      SalesTax.setTaxOriginCountry("EE", false);

      return SalesTax.getSalesTax("EE")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.22, "Tax rate should be 22% (national market, no regional tax)"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "national", "Tax area should be NATIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.22, "Tax details #1 rate should be 22%"
          );
        });
    });

    it("🇺🇸 should succeed acquiring United States sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("US")
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, "USD", "Currency should be USD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇺🇸 should succeed acquiring United States > California sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("US", "CA")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.0825, "Tax rate should be 8.25%"
          );

          assert.equal(
            tax.currency, "USD", "Currency should be USD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.0825, "Tax details #1 rate should be 8.25%"
          );
        });
    });

    it("🇺🇸 should succeed acquiring United States > Delaware sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("US", "DE")
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, "USD", "Currency should be USD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇨🇦 should succeed acquiring Canada sales tax with an ignored tax number [no tax origin]", function() {
      return SalesTax.getSalesTax("CA", null, "IGNORED_TAX_NUMBER")
        .then(function(tax) {
          assert.equal(
            tax.type, "gst", "Tax type should be GST"
          );

          assert.equal(
            tax.rate, 0.05, "Tax rate should be 5%"
          );

          assert.equal(
            tax.currency, "CAD", "Currency should be CAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "gst", "Tax details #1 type should be GST"
          );

          assert.equal(
            tax.details[0].rate, 0.05, "Tax details #1 rate should be 5%"
          );
        });
    });

    it("🇨🇦 should succeed acquiring Canada > Quebec sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("CA", "QC")
        .then(function(tax) {
          assert.equal(
            tax.type, "gst+qst", "Tax type should be GST+QST"
          );

          assert.equal(
            tax.rate, 0.14975, "Tax rate should be 14.975%"
          );

          assert.equal(
            tax.currency, "CAD", "Currency should be CAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 2, "Tax details should contain 2 tax rates"
          );

          assert.equal(
            tax.details[0].type, "gst", "Tax details #1 type should be GST"
          );

          assert.equal(
            tax.details[0].rate, 0.05, "Tax details #1 rate should be 5%"
          );

          assert.equal(
            tax.details[1].type, "qst", "Tax details #2 type should be QST"
          );

          assert.equal(
            tax.details[1].rate, 0.09975, "Tax details #2 rate should be 9.975%"
          );
        });
    });

    it("🇨🇦 should succeed acquiring Canada > Ontario sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("CA", "ON")
        .then(function(tax) {
          assert.equal(
            tax.type, "gst+hst", "Tax type should be GST+HST"
          );

          assert.equal(
            tax.rate, 0.13, "Tax rate should be 13%"
          );

          assert.equal(
            tax.currency, "CAD", "Currency should be CAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 2, "Tax details should contain 2 tax rates"
          );

          assert.equal(
            tax.details[0].type, "gst", "Tax details #1 type should be GST"
          );

          assert.equal(
            tax.details[0].rate, 0.05, "Tax details #1 rate should be 5%"
          );

          assert.equal(
            tax.details[1].type, "hst", "Tax details #2 type should be HST"
          );

          assert.equal(
            tax.details[1].rate, 0.08, "Tax details #2 rate should be 8%"
          );
        });
    });

    it("🇨🇦 should succeed acquiring Canada > Yukon sales tax [no tax origin]", function() {
      return SalesTax.getSalesTax("CA", "YT")
        .then(function(tax) {
          assert.equal(
            tax.type, "gst", "Tax type should be GST"
          );

          assert.equal(
            tax.rate, 0.05, "Tax rate should be 5%"
          );

          assert.equal(
            tax.currency, "CAD", "Currency should be CAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "gst", "Tax details #1 type should be GST"
          );

          assert.equal(
            tax.details[0].rate, 0.05, "Tax details #1 rate should be 5%"
          );
        });
    });
  });

  describe("getAmountWithSalesTax", function() {
    it("🏳 should fail processing a non-existing country amount including sales tax (no tax number) [no tax origin]", function() {
      return SalesTax.getAmountWithSalesTax("DONT_EXIST", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, null, "Currency should be empty"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1000.00, "Total amount should be 1000.00"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
    });

    it("🇫🇷 should succeed processing France amount including sales tax (no tax number) [no tax origin]", function() {
      return SalesTax.getAmountWithSalesTax("FR", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1200.00, "Total amount should be 1200.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );

          assert.equal(
            tax.details[0].amount, 200.00, "Tax details #1 amount should be 200.00"
          );
        });
    });

    it("🇩🇪 should succeed processing Germany amount including sales tax with restored rate (no tax number) [Maltese tax origin]", function() {
      // Monkey-patch current date method, as to simulate post-update date
      SalesTax.__getCurrentDate = function() {
        return (new Date("2021-02-01T10:00:00.000Z"));
      };

      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("DE", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.19, "Tax rate should be 19%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1190.00, "Total amount should be 1190.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.19, "Tax details #1 rate should be 19%"
          );

          assert.equal(
            tax.details[0].amount, 190.00, "Tax details #1 amount should be 190.00"
          );
        });
    });

    it("🇩🇪 should succeed processing Germany amount including sales tax with temporary rate (no tax number) [Maltese tax origin]", function() {
      // Monkey-patch current date method, as to simulate post-update date
      SalesTax.__getCurrentDate = function() {
        return (new Date("2020-07-01T10:00:00.000Z"));
      };

      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("DE", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.16, "Tax rate should be 16%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1160.00, "Total amount should be 1160.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.16, "Tax details #1 rate should be 16%"
          );

          assert.equal(
            tax.details[0].amount, 160.00, "Tax details #1 amount should be 160.00"
          );
        });
    });

    it("🇩🇪 should succeed processing Germany amount including sales tax with legacy rate (no tax number) [Maltese tax origin]", function() {
      // Monkey-patch current date method, as to simulate pre-update date
      SalesTax.__getCurrentDate = function() {
        return (new Date("2020-06-20T10:00:00.000Z"));
      };

      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("DE", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.19, "Tax rate should be 19%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1190.00, "Total amount should be 1190.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.19, "Tax details #1 rate should be 19%"
          );

          assert.equal(
            tax.details[0].amount, 190.00, "Tax details #1 amount should be 190.00"
          );
        });
    });

    it("🇮🇪 should succeed processing Ireland amount including sales tax with restored rate (no tax number) [Maltese tax origin]", function() {
      // Monkey-patch current date method, as to simulate post-update date
      SalesTax.__getCurrentDate = function() {
        return (new Date("2021-03-01T10:00:00.000Z"));
      };

      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("IE", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.23, "Tax rate should be 23%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1230.00, "Total amount should be 1230.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.23, "Tax details #1 rate should be 23%"
          );

          assert.equal(
            tax.details[0].amount, 230.00, "Tax details #1 amount should be 230.00"
          );
        });
    });

    it("🇮🇪 should succeed processing Ireland amount including sales tax with temporary rate (no tax number) [Maltese tax origin]", function() {
      // Monkey-patch current date method, as to simulate post-update date
      SalesTax.__getCurrentDate = function() {
        return (new Date("2020-09-01T10:00:00.000Z"));
      };

      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("IE", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.21, "Tax rate should be 21%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1210.00, "Total amount should be 1210.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.21, "Tax details #1 rate should be 16%"
          );

          assert.equal(
            tax.details[0].amount, 210.00, "Tax details #1 amount should be 160.00"
          );
        });
    });

    it("🇮🇪 should succeed processing Ireland amount including sales tax with legacy rate (no tax number) [Maltese tax origin]", function() {
      // Monkey-patch current date method, as to simulate pre-update date
      SalesTax.__getCurrentDate = function() {
        return (new Date("2020-08-20T10:00:00.000Z"));
      };

      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("IE", null, 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.23, "Tax rate should be 23%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "regional", "Tax area should be REGIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1230.00, "Total amount should be 1230.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.23, "Tax details #1 rate should be 19%"
          );

          assert.equal(
            tax.details[0].amount, 230.00, "Tax details #1 amount should be 190.00"
          );
        });
    });

    it("🇲🇹 should succeed processing Malta amount including sales tax (no tax number) [Maltese tax origin]", function() {
      SalesTax.setTaxOriginCountry("MT");

      return SalesTax.getAmountWithSalesTax("MT", null, 500.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.18, "Tax rate should be 18%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "national", "Tax area should be NATIONAL"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 500.00, "Price amount should be 500.00"
          );

          assert.equal(
            tax.total, 590.00, "Total amount should be 590.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.18, "Tax details #1 rate should be 18%"
          );

          assert.equal(
            tax.details[0].amount, 90.00, "Tax details #1 amount should be 90.00"
          );
        });
    });

    it("🇨🇦 should succeed processing Canada amount including sales tax (no tax number) [no tax origin]", function() {
      return SalesTax.getAmountWithSalesTax("CA", null, 723.21)
        .then(function(tax) {
          assert.equal(
            tax.type, "gst", "Tax type should be GST"
          );

          assert.equal(
            tax.rate, 0.05, "Tax rate should be 5%"
          );

          assert.equal(
            tax.currency, "CAD", "Currency should be CAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 723.21, "Price amount should be 723.21"
          );

          assert.equal(
            tax.total, 759.3705000000001, "Total amount should be 759.3705000000001"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "gst", "Tax details #1 type should be GST"
          );

          assert.equal(
            tax.details[0].rate, 0.05, "Tax details #1 rate should be 5%"
          );

          assert.equal(
            tax.details[0].amount, 36.160500000000006, "Tax details #1 amount should be 36.160500000000006"
          );
        });
    });

    it("🇨🇦 should succeed processing Canada > Ontario amount including sales tax (no tax number) [no tax origin]", function() {
      return SalesTax.getAmountWithSalesTax("CA", "ON", 800.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "gst+hst", "Tax type should be GST+HST"
          );

          assert.equal(
            tax.rate, 0.13, "Tax rate should be 13%"
          );

          assert.equal(
            tax.currency, "CAD", "Currency should be CAD"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 800.00, "Price amount should be 800.00"
          );

          assert.equal(
            tax.total, 903.9999999999999, "Total amount should be 903.9999999999999"
          );

          assert.equal(
            tax.details.length, 2, "Tax details should contain 2 tax rates"
          );

          assert.equal(
            tax.details[0].type, "gst", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.05, "Tax details #1 rate should be 5%"
          );

          assert.equal(
            tax.details[0].amount, 40.00, "Tax details #1 amount should be 40.00"
          );

          assert.equal(
            tax.details[1].type, "hst", "Tax details #2 type should be VAT"
          );

          assert.equal(
            tax.details[1].rate, 0.08, "Tax details #2 rate should be 8%"
          );

          assert.equal(
            tax.details[1].amount, 64.00, "Tax details #2 amount should be 64.00"
          );
        });
    });

    it("🇫🇷 should succeed processing France amount including sales tax (non tax-exempt tax number) [no tax origin]", function() {
      return SalesTax.getAmountWithSalesTax("FR", null, 1000.00, "NON_EXEMPT_TAX_NUMBER")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.equal(
            tax.charge.direct, true, "Should perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, false, "Should not perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1200.00, "Total amount should be 1200.00"
          );

          assert.equal(
            tax.details.length, 1, "Tax details should contain 1 tax rate"
          );

          assert.equal(
            tax.details[0].type, "vat", "Tax details #1 type should be VAT"
          );

          assert.equal(
            tax.details[0].rate, 0.20, "Tax details #1 rate should be 20%"
          );

          assert.equal(
            tax.details[0].amount, 200.00, "Tax details #1 amount should be 200.00"
          );
        });
    });

    it("🇫🇷 should succeed processing France amount including sales tax (tax-exempt tax number) [no tax origin]", function() {
      return SalesTax.getAmountWithSalesTax("FR", null, 1000.00, "FR50833085806")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.currency, "EUR", "Currency should be EUR"
          );

          assert.equal(
            tax.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.equal(
            tax.exchange, "business", "Tax exchange should be BUSINESS"
          );

          assert.equal(
            tax.charge.direct, false, "Should not perform a direct charge"
          );

          assert.equal(
            tax.charge.reverse, true, "Should perform a reverse charge"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1000.00, "Total amount should be 1000.00"
          );

          assert.equal(
            tax.details.length, 0, "Tax details should be empty"
          );
        });
      });

      it("🇪🇸 should succeed processing Spain > Las Palmas amount including sales tax (no tax number) [no tax origin]", function() {
        return SalesTax.getAmountWithSalesTax("ES", "GC", 1000.00)
          .then(function(tax) {
            assert.equal(
              tax.type, "igic", "Tax type should be IGIC"
            );

            assert.equal(
              tax.rate, 0.07, "Tax rate should be 7%"
            );

            assert.equal(
              tax.currency, "EUR", "Currency should be EUR"
            );

            assert.equal(
              tax.area, "worldwide", "Tax area should be WORLDWIDE"
            );

            assert.equal(
              tax.exchange, "consumer", "Tax exchange should be CONSUMER"
            );

            assert.equal(
              tax.charge.direct, true, "Should perform a direct charge"
            );

            assert.equal(
              tax.charge.reverse, false, "Should not perform a reverse charge"
            );

            assert.equal(
              tax.price, 1000.00, "Price amount should be 1000.00"
            );

            assert.equal(
              tax.total, 1070.00, "Total amount should be 1070.00"
            );

            assert.equal(
              tax.details.length, 1, "Tax details should contain 1 tax rate"
            );
          });
        });

      it("🇪🇸 should succeed processing Spain > Huesca amount including sales tax (no tax number) [no tax origin]", function() {
        return SalesTax.getAmountWithSalesTax("ES", "HU", 1000.00)
          .then(function(tax) {
            assert.equal(
              tax.type, "vat", "Tax type should be VAT"
            );

            assert.equal(
              tax.rate, 0.21, "Tax rate should be 21%"
            );

            assert.equal(
              tax.currency, "EUR", "Currency should be EUR"
            );

            assert.equal(
              tax.area, "worldwide", "Tax area should be WORLDWIDE"
            );

            assert.equal(
              tax.exchange, "consumer", "Tax exchange should be CONSUMER"
            );

            assert.equal(
              tax.charge.direct, true, "Should perform a direct charge"
            );

            assert.equal(
              tax.charge.reverse, false, "Should not perform a reverse charge"
            );

            assert.equal(
              tax.price, 1000.00, "Price amount should be 1000.00"
            );

            assert.equal(
              tax.total, 1210.00, "Total amount should be 1000.00"
            );

            assert.equal(
              tax.details[0].amount, 210.00, "Tax details #1 amount should be 200.00"
            );
          });
        });
  });

  describe("validateTaxNumber", function() {
    it("🇫🇷 should check France tax number as valid", function() {
      return SalesTax.validateTaxNumber("FR", "FR50833085806")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid"
          );
        });
    });

    it("🇫🇷 should check France tax number with spaces as valid", function() {
      return SalesTax.validateTaxNumber("FR", "FR 875241726 99")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid"
          );
        });
    });

    it("🇫🇷 should check France tax number as invalid", function() {
      return SalesTax.validateTaxNumber("FR", "INVALID_TAX_NUMBER")
        .then(function(isValid) {
          assert.ok(
            !isValid, "Tax number should be invalid"
          );
        });
    });

    it("🇫🇷 should check France tax number as valid, even if invalid", function() {
      SalesTax.toggleEnabledTaxNumberValidation(false);

      return SalesTax.validateTaxNumber("FR", "INVALID_NON_VALIDATED_TAX_NUMBER")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid (even if invalid)"
          );
        });
    });

    it("🇬🇷 should check Greece tax number as valid", function() {
      return SalesTax.validateTaxNumber("GR", "EL094019245")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid"
          );
        });
    });

    it("🇬🇧 should check United Kingdom tax number as valid", function() {
      return SalesTax.validateTaxNumber("GB", "GB867935561")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid"
          );
        });
    });

    it("🇬🇧 should check United Kingdom tax number as invalid", function() {
      return SalesTax.validateTaxNumber("GB", "INVALID_TAX_NUMBER")
        .then(function(isValid) {
          assert.ok(
            !isValid, "Tax number should be invalid"
          );
        });
    });
  });

  describe("getTaxExchangeStatus", function() {
    it("🇲🇦 should check Morocco as non tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("MA")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            !exchangeStatus.exempt, "Country should not be tax-exempt"
          );
        });
    });

    it("🇭🇰 should check Hong Kong as tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("HK")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            exchangeStatus.exempt, "Country should be tax-exempt"
          );
        });
    });

    it("🇺🇸 should check United States > Delaware as tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("US", "DE")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            exchangeStatus.exempt, "State should be tax-exempt"
          );
        });
    });

    it("🇫🇷 should check valid France tax number as tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("FR", null, "FR50833085806")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "business", "Tax exchange should be BUSINESS"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            exchangeStatus.exempt, "Tax number should be tax-exempt"
          );
        });
    });

    it("🇫🇷 should check invalid France tax number as non tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("FR", null, "NON_EXEMPT_TAX_NUMBER")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            !exchangeStatus.exempt, "Tax number should not be tax-exempt (invalid)"
          );
        });
    });

    it("🇺🇸 should check United States > California as non tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("US", "CA")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            !exchangeStatus.exempt, "State should not be tax-exempt"
          );
        });
    });

    it("🇺🇸 should check valid United States > Texas tax number as tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("US", "TX", "01-1234567")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            exchangeStatus.exempt, "Tax number should be tax-exempt"
          );
        });
    });

    it("🇺🇸 should check invalid United States > Texas tax number as non tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("US", "TX", "0112345-67")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            !exchangeStatus.exempt, "Tax number should not be tax-exempt (invalid)"
          );
        });
    });

    it("🇨🇦 should check Canada > Manitoba as non tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("CA", "MB")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            !exchangeStatus.exempt, "State should not be tax-exempt"
          );
        });
    });

    it("🇨🇦 should check valid Canada > Quebec tax number as tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("CA", "QC", "123456789")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            exchangeStatus.exempt, "Tax number should be tax-exempt"
          );
        });
    });

    it("🇨🇦 should check invalid Canada > Quebec tax number as non tax-exempt", function() {
      return SalesTax.getTaxExchangeStatus("CA", "QC", "INVALID_TAX_NUMBER")
        .then(function(exchangeStatus) {
          assert.ok(
            exchangeStatus.exchange, "consumer", "Tax exchange should be CONSUMER"
          );

          assert.ok(
            exchangeStatus.area, "worldwide", "Tax area should be WORLDWIDE"
          );

          assert.ok(
            !exchangeStatus.exempt, "Tax number should not be tax-exempt (invalid)"
          );
        });
    });
  });
});
