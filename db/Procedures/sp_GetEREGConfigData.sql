if exists (select * from sys.objects where name='sp_GetEREGConfigData' and type='P')
	drop procedure sp_GetEREGConfigData
GO

create procedure sp_GetEREGConfigData
AS
	select URL,USER_NAME,USER_PASSWORD
	from SERVICE_CONFIGURATION
		where CODE='EREG'
GO
