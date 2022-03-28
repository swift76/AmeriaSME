if exists (select * from sys.objects where name='sp_GetNORQConfigData' and type='P')
	drop procedure sp_GetNORQConfigData
GO

create procedure sp_GetNORQConfigData
AS
	select URL,USER_NAME,USER_PASSWORD
	from SERVICE_CONFIGURATION
		where CODE='NORQ'
GO
