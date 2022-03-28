if exists (select * from sys.objects where name='sp_GetLoanSecured' and type='P')
	drop procedure dbo.sp_GetLoanSecured
GO

create procedure dbo.sp_GetLoanSecured(@CODE char(2))

AS
	select IS_SECURED
	from dbo.LOAN_TYPE
	where CODE = @CODE
GO
