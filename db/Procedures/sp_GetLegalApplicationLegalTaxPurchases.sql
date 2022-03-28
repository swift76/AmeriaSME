create or alter procedure sp_GetLegalApplicationLegalTaxPurchases(@APPLICATION_ID	uniqueidentifier)
AS
	select PERIOD
		,UPDATE_DATE
		,AMOUNT
	from TAX_QUERY_RESULT_PURCHASE
	where APPLICATION_ID=@APPLICATION_ID
GO
