/*
 * node-sales-tax
 *
 * Copyright 2017, Valerian Saliou
 * Author: Valerian Saliou <valerian@valeriansaliou.name>
 */


"use strict";


var SalesTax = require("../");
var assert = require("assert");


describe("node-fast-ratelimit", function() {
  // Increase timeout as some tests call the network for VAT number checks
  this.timeout(10000);

  // Ensure tax number validation is enabled before each pass
  beforeEach(function() {
    SalesTax.toggleEnabledTaxNumberValidation(true);
  });

  describe("hasSalesTax", function() {
    it("should fail checking for a non-existing country", function() {
      assert.ok(
        !SalesTax.hasSalesTax("DONT_EXIST"), "Country should not have sales tax"
      );
    });

    it("should fail checking for Hong Kong", function() {
      assert.ok(
        !SalesTax.hasSalesTax("HK"), "Country should not have sales tax"
      );
    });

    it("should succeed checking for Morocco", function() {
      assert.ok(
        SalesTax.hasSalesTax("MA"), "Country should have sales tax"
      );
    });

    it("should succeed checking for France (lower-case code)", function() {
      assert.ok(
        SalesTax.hasSalesTax("fr"), "Country should have sales tax"
      );
    });

    it("should succeed checking for France (upper-case code)", function() {
      assert.ok(
        SalesTax.hasSalesTax("FR"), "Country should have sales tax"
      );
    });
  });

  describe("getSalesTax", function() {
    it("should fail acquiring a non-existing country sales tax", function() {
      return SalesTax.getSalesTax("DONT_EXIST")
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.exempt, true, "Should be tax-exempt"
          );
        });
    });

    it("should fail acquiring Hong Kong sales tax", function() {
      return SalesTax.getSalesTax("HK")
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.exempt, true, "Should be tax-exempt"
          );
        });
    });

    it("should succeed acquiring Morocco sales tax", function() {
      return SalesTax.getSalesTax("MA")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );
        });
    });

    it("should succeed acquiring France sales tax (lower-case code)", function() {
      return SalesTax.getSalesTax("fr")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );
        });
    });

    it("should succeed acquiring France sales tax (upper-case code)", function() {
      return SalesTax.getSalesTax("FR")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );
        });
    });

    it("should succeed acquiring France sales tax with an invalid tax number", function() {
      return SalesTax.getSalesTax("FR", "INVALID_TAX_NUMBER")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );
        });
    });

    it("should succeed acquiring France sales tax with a tax-exempt tax number", function() {
      return SalesTax.getSalesTax("FR", "87524172699")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0% (tax-exempt)"
          );

          assert.equal(
            tax.exempt, true, "Should be tax-exempt"
          );
        });
    });

    it("should succeed acquiring Canada sales tax with an ignored tax number", function() {
      return SalesTax.getSalesTax("CA", "IGNORED_TAX_NUMBER")
        .then(function(tax) {
          assert.equal(
            tax.type, "gst", "Tax type should be GST"
          );

          assert.equal(
            tax.rate, 0.05, "Tax rate should be 5%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );
        });
    });
  });

  describe("getAmountWithSalesTax", function() {
    it("should fail processing a non-existing country amount including sales tax (no tax number)", function() {
      return SalesTax.getAmountWithSalesTax("DONT_EXIST", 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "none", "Tax type should be NONE"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.exempt, true, "Should be tax-exempt"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1000.00, "Total amount should be 1000.00"
          );
        });
    });

    it("should succeed processing France amount including sales tax (no tax number)", function() {
      return SalesTax.getAmountWithSalesTax("FR", 1000.00)
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1200.00, "Total amount should be 1200.00"
          );
        });
    });

    it("should succeed processing France amount including sales tax (non tax-exempt tax number)", function() {
      return SalesTax.getAmountWithSalesTax("FR", 1000.00, "NON_EXEMPT_TAX_NUMBER")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.20, "Tax rate should be 20%"
          );

          assert.equal(
            tax.exempt, false, "Should not be tax-exempt"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1200.00, "Total amount should be 1200.00"
          );
        });
    });

    it("should succeed processing France amount including sales tax (tax-exempt tax number)", function() {
      return SalesTax.getAmountWithSalesTax("FR", 1000.00, "87524172699")
        .then(function(tax) {
          assert.equal(
            tax.type, "vat", "Tax type should be VAT"
          );

          assert.equal(
            tax.rate, 0.00, "Tax rate should be 0%"
          );

          assert.equal(
            tax.exempt, true, "Should be tax-exempt"
          );

          assert.equal(
            tax.price, 1000.00, "Price amount should be 1000.00"
          );

          assert.equal(
            tax.total, 1000.00, "Total amount should be 1000.00"
          );
        });
      });
  });

  describe("validateTaxNumber", function() {
    it("should check France tax number as valid", function() {
      return SalesTax.validateTaxNumber("FR", "87524172699")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid"
          );
        });
    });

    it("should check France tax number as invalid", function() {
      return SalesTax.validateTaxNumber("FR", "INVALID_TAX_NUMBER")
        .then(function(isValid) {
          assert.ok(
            !isValid, "Tax number should be invalid"
          );
        });
    });

    it("should check France tax number as valid, even if invalid", function() {
      SalesTax.toggleEnabledTaxNumberValidation(false);

      return SalesTax.validateTaxNumber("FR", "INVALID_NON_VALIDATED_TAX_NUMBER")
        .then(function(isValid) {
          assert.ok(
            isValid, "Tax number should be valid (even if invalid)"
          );
        });
    });
  });

  describe("isTaxExempt", function() {
    it("should check Morocco as non tax-exempt", function() {
      return SalesTax.isTaxExempt("MA")
        .then(function(isTaxExempt) {
          assert.ok(
            !isTaxExempt, "Country should not be tax-exempt"
          );
        });
    });

    it("should check Hong Kong as tax-exempt", function() {
      return SalesTax.isTaxExempt("KH")
        .then(function(isTaxExempt) {
          assert.ok(
            isTaxExempt, "Country should be tax-exempt"
          );
        });
    });

    it("should check valid France tax number as tax-exempt", function() {
      return SalesTax.isTaxExempt("FR", "87524172699")
        .then(function(isTaxExempt) {
          assert.ok(
            isTaxExempt, "Tax number should be tax-exempt"
          );
        });
    });

    it("should check invalid France tax number as non tax-exempt", function() {
      return SalesTax.isTaxExempt("FR", "NON_EXEMPT_TAX_NUMBER")
        .then(function(isTaxExempt) {
          assert.ok(
            !isTaxExempt, "Tax number should not be tax-exempt (invalid)"
          );
        });
    });

    it("should check ignored Canada tax number as non tax-exempt", function() {
      return SalesTax.isTaxExempt("CA", "IGNORED_TAX_NUMBER")
        .then(function(isTaxExempt) {
          assert.ok(
            !isTaxExempt, "Tax number should not be tax-exempt (ignored)"
          );
        });
    });
  });
});
