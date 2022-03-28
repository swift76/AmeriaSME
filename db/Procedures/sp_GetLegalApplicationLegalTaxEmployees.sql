create or alter procedure sp_GetLegalApplicationLegalTaxEmployees(@APPLICATION_ID	uniqueidentifier)
AS
	select PERIOD
		,UPDATE_DATE
		,NUMBER
	from TAX_QUERY_RESULT_EMPLOYEE
	where APPLICATION_ID=@APPLICATION_ID
GO
