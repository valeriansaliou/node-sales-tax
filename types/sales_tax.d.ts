/*
 * node-sales-tax
 *
 * Copyright 2023, Valerian Saliou
 * Author: Ben Salili-James <https://github.com/bensalilijames>
 */


declare namespace SalesTax {
  interface SalesTaxResult {
    type: string;
    rate: number;
    area: "worldwide" | "national" | "regional";
    exchange: "business" | "consumer";

    charge: {
      direct: boolean;
      reverse: boolean;
    };

    details: Array<{ type: string; rate: number }>;
  }

  interface SalesTaxAmountResult extends SalesTaxResult {
    price: number;
    total: number;
  }

  interface TaxExchangeStatus {
    exchange: "business" | "consumer";
    area: "worldwide" | "national" | "regional";
    exempt: boolean;
  }

  class SalesTax {
    hasSalesTax(countryCode: string): boolean;
    hasStateSalesTax(countryCode: string, stateCode: string): boolean;
    getSalesTax(countryCode: string, stateCode?: string | null, taxNumber?: string): Promise<SalesTaxResult>;

    getAmountWithSalesTax(
      countryCode: string,
      stateCode?: string | null,
      amount?: number,
      taxNumber?: string,
    ): Promise<SalesTaxAmountResult>;

    validateTaxNumber(countryCode: string, taxNumber: string): Promise<boolean>;

    getTaxExchangeStatus(
      countryCode: string,
      stateCode?: string | null,
      taxNumber?: string,
    ): Promise<TaxExchangeStatus>;

    setTaxOriginCountry(countryCode: string, useRegionalTax?: boolean): void;
    toggleEnabledTaxNumberValidation(isEnabled: boolean): void;
    toggleEnabledTaxNumberFraudCheck(isEnabled: boolean): void;
  }
}

declare const salesTax: InstanceType<typeof SalesTax.SalesTax>;

export = salesTax;
export as namespace SalesTax;
