if exists (select * from sys.objects where name='sp_SaveCompanyBalanceType' and type='P')
	drop procedure sp_SaveCompanyBalanceType
GO

create procedure sp_SaveCompanyBalanceType(@CODE	char(2),
										   @NAME_AM	nvarchar(100),
										   @NAME_EN	varchar(100))
AS
	insert into COMPANY_BALANCE_TYPE (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
