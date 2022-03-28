create or alter procedure sp_GetLegalApplicationLegalTaxProfits(@APPLICATION_ID	uniqueidentifier)
AS
	select PERIOD
		,UPDATE_DATE
		,AMOUNT
	from TAX_QUERY_RESULT_PROFIT
	where APPLICATION_ID=@APPLICATION_ID
GO
