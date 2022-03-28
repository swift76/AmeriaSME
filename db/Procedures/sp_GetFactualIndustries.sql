if exists (select * from sys.objects where name='sp_GetFactualIndustries' and type='P')
	drop procedure sp_GetFactualIndustries
GO

create procedure sp_GetFactualIndustries(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from FACTUAL_INDUSTRY
GO
