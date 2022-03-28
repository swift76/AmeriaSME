if exists (select * from sys.objects where name='sp_GetActivities' and type='P')
	drop procedure sp_GetActivities
GO

create procedure sp_GetActivities(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from ACTIVITY
GO
