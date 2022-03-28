create or alter procedure sp_GetLegalApplicationLegalTaxPayments(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(PAYMENT_TYPE) as PAYMENT_TYPE
		,PERIOD
		,UPDATE_DATE
		,AMOUNT
		,dbo.f_GetReportDate(PERIOD) as REPORT_DATE
	from TAX_QUERY_RESULT_PAYMENT
	where APPLICATION_ID=@APPLICATION_ID
		and len(PERIOD)=7
	order by REPORT_DATE desc
GO
