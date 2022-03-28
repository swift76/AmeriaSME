create or alter procedure sp_GetLoanSpecialistApplicationCompanyBalance(@ID	uniqueidentifier)
AS
	select COMPANY_BALANCE_TYPE_CODE,
		AMOUNT,
		dbo.ahf_Unicode2ANSI(isnull(COMMENT,'')) as COMMENT
	from APPLICATION_COMPANY_BALANCE
	where APPLICATION_ID=@ID
GO
