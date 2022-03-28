if exists (select * from sys.objects where name='sp_GetCompanyNonOperationalExpenses' and type='P')
	drop procedure dbo.sp_GetCompanyNonOperationalExpenses
GO

create procedure dbo.sp_GetCompanyNonOperationalExpenses(@APPLICATION_ID	uniqueidentifier,
														 @LANGUAGE_CODE		char(2))
AS
	select
		t.CODE,
		case @LANGUAGE_CODE
			when 'AM' then t.NAME_AM
			else t.NAME_EN
		end as NAME,
		a.AMOUNT,
		a.COMMENT
	from dbo.COMPANY_NONOPERATIONAL_EXPENSE_TYPE t
	left join dbo.APPLICATION_COMPANY_NONOPERATIONAL_EXPENSE a
		on t.CODE = a.COMPANY_NONOPERATIONAL_EXPENSE_TYPE_CODE
			and a.APPLICATION_ID = @APPLICATION_ID
GO
