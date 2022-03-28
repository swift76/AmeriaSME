create or alter procedure sp_GetLoanSpecialistApplicationCompanyOtherStatistics(@ID	uniqueidentifier)
AS
	select COMPANY_OTHER_STATISTICS_TYPE_CODE,
		AMOUNT,
		dbo.ahf_Unicode2ANSI(isnull(COMMENT,'')) as COMMENT
	from APPLICATION_COMPANY_OTHER_STATISTICS
	where APPLICATION_ID=@ID
GO
