using System;
using System.Collections.Generic;

namespace IntelART.Ameria.CLRServices
{
    public class TaxDebt
    {
        public string Type { get; set; }
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal Debt { get; set; }
        public decimal Outstanding { get; set; }
        public decimal Fine { get; set; }
        public decimal Overpayment { get; set; }
    }

    public class TaxPayment
    {
        public string Type { get; set; }
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal Amount { get; set; }
    }

    public class TaxPurchase
    {
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal Amount { get; set; }
    }

    public class TaxSale
    {
        public string Type { get; set; }
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal Amount { get; set; }
    }

    public class TaxSalaryFund
    {
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal Amount { get; set; }
    }

    public class TaxProfit
    {
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
        public decimal Amount { get; set; }
    }

    public class TaxActivity
    {
        public string Type { get; set; }
        public decimal Proportion { get; set; }
    }

    public class TaxEmployee
    {
        public int Number { get; set; }
        public string Period { get; set; }
        public DateTime? UpdateDate { get; set; }
    }

    public class TaxAddress
    {
        public string Region { get; set; }
        public string Community { get; set; }
        public string Street { get; set; }
        public string Building { get; set; }
        public string Apartment { get; set; }
    }

    public class TaxReportCorrection
    {
        public string ReportName { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string FieldName { get; set; }
        public decimal FieldValue { get; set; }
    }

    public class TaxData
    {
        public string TaxType { get; set; }
        public string Status { get; set; }
        public string Type { get; set; }
        public TaxAddress RegistrationAddress { get; set; }
        public TaxAddress CurrentAddress { get; set; }
        public List<TaxDebt> Debts { get; set; }
        public List<TaxPayment> Payments { get; set; }
        public List<TaxPurchase> Purchases { get; set; }
        public List<TaxSale> Sales { get; set; }
        public List<TaxActivity> Activities { get; set; }
        public List<TaxEmployee> Employees { get; set; }
        public List<TaxSalaryFund> SalaryFunds { get; set; }
        public List<TaxProfit> Profits { get; set; }
        public List<TaxReportCorrection> ReportCorrections { get; set; }

        public TaxData()
        {
            RegistrationAddress = new TaxAddress();
            CurrentAddress = new TaxAddress();
            Debts = new List<TaxDebt>();
            Payments = new List<TaxPayment>();
            Purchases = new List<TaxPurchase>();
            Sales = new List<TaxSale>();
            Activities = new List<TaxActivity>();
            Employees = new List<TaxEmployee>();
            SalaryFunds = new List<TaxSalaryFund>();
            Profits = new List<TaxProfit>();
            ReportCorrections = new List<TaxReportCorrection>();
        }
    }
}
