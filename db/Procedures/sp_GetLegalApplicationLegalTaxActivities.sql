create or alter procedure sp_GetLegalApplicationLegalTaxActivities(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(ACTIVITY_TYPE) as ACTIVITY_TYPE
		,PROPORTION
	from TAX_QUERY_RESULT_ACTIVITY
	where APPLICATION_ID=@APPLICATION_ID
GO
