create or alter procedure sp_GetLoanSpecialistApplicationCompanyProfit(@ID	uniqueidentifier)
AS
	select INDUSTRY_CODE,
		AMOUNT,
		dbo.ahf_Unicode2ANSI(isnull(COMMENT,'')) as COMMENT
	from APPLICATION_COMPANY_PROFIT
	where APPLICATION_ID=@ID
GO
