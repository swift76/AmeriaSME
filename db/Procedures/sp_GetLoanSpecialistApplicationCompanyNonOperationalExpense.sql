create or alter procedure sp_GetLoanSpecialistApplicationCompanyNonOperationalExpense(@ID	uniqueidentifier)
AS
	select COMPANY_NONOPERATIONAL_EXPENSE_TYPE_CODE,
		AMOUNT,
		dbo.ahf_Unicode2ANSI(isnull(COMMENT,'')) as COMMENT
	from APPLICATION_COMPANY_NONOPERATIONAL_EXPENSE
	where APPLICATION_ID=@ID
GO
