create or alter procedure sp_GetLegalApplicationLegalTaxDebts(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(DEBT_TYPE) as DEBT_TYPE
		,PERIOD
		,UPDATE_DATE
		,DEBT
		,OUTSTANDING
		,FINE
		,OVERPAYMENT
	from TAX_QUERY_RESULT_DEBT
	where APPLICATION_ID=@APPLICATION_ID
GO
