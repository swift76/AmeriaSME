if exists (select * from sys.objects where name='sp_GetCancellationReasons' and type='P')
	drop procedure dbo.sp_GetCancellationReasons
GO

create procedure dbo.sp_GetCancellationReasons(@LANGUAGE_CODE	char(2))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from dbo.CANCELLATION_REASON
GO
