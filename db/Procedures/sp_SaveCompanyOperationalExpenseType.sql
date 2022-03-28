if exists (select * from sys.objects where name='sp_SaveCompanyOperationalExpenseType' and type='P')
	drop procedure sp_SaveCompanyOperationalExpenseType
GO

create procedure sp_SaveCompanyOperationalExpenseType(@CODE		char(2),
													  @NAME_AM	nvarchar(100),
													  @NAME_EN	varchar(100))
AS
	insert into COMPANY_OPERATIONAL_EXPENSE_TYPE (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
