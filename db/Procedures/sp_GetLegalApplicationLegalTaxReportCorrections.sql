create or alter procedure sp_GetLegalApplicationLegalTaxReportCorrections(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(REPORT_NAME) as REPORT_NAME
		,UPDATE_DATE
		,dbo.ahf_Unicode2ANSI(FIELD_NAME) as FIELD_NAME
		,FIELD_VALUE
	from TAX_QUERY_RESULT_REPORT_CORRECTION
	where APPLICATION_ID=@APPLICATION_ID
GO
