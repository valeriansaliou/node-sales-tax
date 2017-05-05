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
  describe("hasSalesTax", function() {
    it("should fail checking for a non-existing country", function() {
      assert.ok(
        !SalesTax.hasSalesTax("DONT_EXIST"), "Country should not have sales tax"
      );
    });

    it("should succeed checking for French country (lower-case code)", function() {
      assert.ok(
        SalesTax.hasSalesTax("fr"), "Country should have sales tax"
      );
    });

    it("should succeed acquiring French sales tax (upper-case code)", function() {
      assert.ok(
        SalesTax.hasSalesTax("FR"), "Country should have sales tax"
      );
    });
  });

  describe("getSalesTax", function() {
    it("should fail acquiring a non-existing country sales tax", function() {
      var tax = SalesTax.getSalesTax("DONT_EXIST");

      assert.equal(
        tax.type, "none", "Tax type should be NONE"
      );

      assert.equal(
        tax.rate, 0.00, "Tax rate should be 0%"
      );

      assert.equal(
        tax.exempt, false, "Should not be tax-exempt"
      );
    });

    it("should succeed acquiring French sales tax (lower-case code)", function() {
      var tax = SalesTax.getSalesTax("fr");

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

    it("should succeed acquiring French sales tax (upper-case code)", function() {
      var tax = SalesTax.getSalesTax("FR");

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

    it("should succeed acquiring French sales tax with an invalid tax number", function() {
      var tax = SalesTax.getSalesTax("FR", "FRINVALID");

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

    it("should succeed acquiring French sales tax with a tax-exempt tax number", function() {
      // TODO
      var tax = SalesTax.getSalesTax("FR", "FRXXXXXXXX");

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

  describe("getAmountWithSalesTax", function() {
    it("should fail processing a non-existing country amount including sales tax (no tax number)", function() {
      var tax = SalesTax.getAmountWithSalesTax("DONT_EXIST", 1000.00);

      assert.equal(
        tax.type, "none", "Tax type should be NONE"
      );

      assert.equal(
        tax.rate, 0.00, "Tax rate should be 0%"
      );

      assert.equal(
        tax.exempt, false, "Should not be tax-exempt"
      );

      assert.equal(
        tax.price, 1000.00, "Price amount should be 1000.00"
      );

      assert.equal(
        tax.total, 1000.00, "Total amount should be 1000.00"
      );
    });

    it("should succeed processing a French country amount including sales tax (no tax number)", function() {
      var tax = SalesTax.getAmountWithSalesTax("FR", 1000.00);

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

    it("should succeed processing a French country amount including sales tax (non tax-exempt tax number)", function() {
      // TODO
      var tax = SalesTax.getAmountWithSalesTax("FR", 1000.00, "FRXXXXXXXX");

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

    it("should succeed processing a French country amount including sales tax (tax-exempt tax number)", function() {
      // TODO
      var tax = SalesTax.getAmountWithSalesTax("FR", 1000.00, "FRXXXXXXXX");

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

  describe("validateTaxNumber", function() {
    it("should check French tax number as valid", function() {
      // TODO

      assert.ok(
        SalesTax.validateTaxNumber("FRXXXXXXXX"), "Tax number should be valid"
      );
    });

    it("should check French tax number as invalid", function() {
      assert.ok(
        !SalesTax.validateTaxNumber("FRINVALID"), "Tax number should be invalid"
      );
    });
  });

  describe("isTaxExempt", function() {
    it("should check valid French tax number as tax-exempt", function() {
      // TODO

      assert.ok(
        SalesTax.isTaxExempt("FRXXXXXXXX"), "Tax number should be tax-exempt"
      );
    });

    it("should check valid French tax number as non tax-exempt", function() {
      // TODO

      assert.ok(
        !SalesTax.isTaxExempt("FRXXXXXXXX"), "Tax number should not be tax-exempt (valid)"
      );
    });

    it("should check invalid French tax number as non tax-exempt", function() {
      assert.ok(
        !SalesTax.isTaxExempt("FRINVALID"), "Tax number should not be tax-exempt (invalid)"
      );
    });
  });
});
