if exists (select * from sys.objects where name='sp_GetIndustryTypes' and type='P')
	drop procedure sp_GetIndustryTypes
GO

create procedure sp_GetIndustryTypes(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from INDUSTRY_TYPE
GO
