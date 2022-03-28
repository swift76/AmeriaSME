if exists (select * from sys.objects where name='sp_GetLoanRepaymentForms' and type='P')
	drop procedure dbo.sp_GetLoanRepaymentForms
GO

create procedure dbo.sp_GetLoanRepaymentForms(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case upper(@LANGUAGE_CODE)
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from dbo.LOAN_REPAYMENT_FORM
GO
