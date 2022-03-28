create or alter procedure sp_GetLegalApplicationLegalTaxSalaryFunds(@APPLICATION_ID	uniqueidentifier)
AS
	select PERIOD
		,UPDATE_DATE
		,AMOUNT
	from TAX_QUERY_RESULT_SALARY_FUND
	where APPLICATION_ID=@APPLICATION_ID
GO
