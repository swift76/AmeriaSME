if exists (select * from sys.objects where name='sp_SaveCompanyNonOperationalExpenseType' and type='P')
	drop procedure sp_SaveCompanyNonOperationalExpenseType
GO

create procedure sp_SaveCompanyNonOperationalExpenseType(@CODE		char(2),
														 @NAME_AM	nvarchar(100),
														 @NAME_EN	varchar(100))
AS
	insert into COMPANY_NONOPERATIONAL_EXPENSE_TYPE (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
