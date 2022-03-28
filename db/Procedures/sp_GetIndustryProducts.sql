if exists (select * from sys.objects where name='sp_GetIndustryProducts' and type='P')
	drop procedure sp_GetIndustryProducts
GO

create procedure sp_GetIndustryProducts(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from INDUSTRY_PRODUCT
GO
