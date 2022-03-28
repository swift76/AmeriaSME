if exists (select * from sys.objects where name='sp_GetBusinessStateTypes' and type='P')
	drop procedure sp_GetBusinessStateTypes
GO

create procedure sp_GetBusinessStateTypes(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from BUSINESS_STATE_TYPE
GO
