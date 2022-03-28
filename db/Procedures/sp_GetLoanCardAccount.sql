if exists (select * from sys.objects where name='sp_GetLoanCardAccount' and type='P')
	drop procedure dbo.sp_GetLoanCardAccount
GO

create procedure dbo.sp_GetLoanCardAccount(@CODE char(2))

AS
	select IS_CARD_ACCOUNT
	from dbo.LOAN_TYPE
	where CODE = @CODE
GO
