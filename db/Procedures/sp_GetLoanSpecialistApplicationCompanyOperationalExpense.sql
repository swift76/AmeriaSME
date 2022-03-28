create or alter procedure sp_GetLoanSpecialistApplicationCompanyOperationalExpense(@ID	uniqueidentifier)
AS
	select COMPANY_OPERATIONAL_EXPENSE_TYPE_CODE,
		AMOUNT,
		dbo.ahf_Unicode2ANSI(isnull(COMMENT,'')) as COMMENT
	from APPLICATION_COMPANY_OPERATIONAL_EXPENSE
	where APPLICATION_ID=@ID
GO
