if exists (select * from sys.objects where name='sp_GetInsuranceCompanies' and type='P')
	drop procedure dbo.sp_GetInsuranceCompanies
GO

create procedure dbo.sp_GetInsuranceCompanies(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case upper(@LANGUAGE_CODE)
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from dbo.INSURANCE_COMPANY
GO
