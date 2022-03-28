if exists (select * from sys.objects where name='sp_GetACRAConfigData' and type='P')
	drop procedure sp_GetACRAConfigData
GO

create procedure sp_GetACRAConfigData
AS
	select URL,USER_NAME,USER_PASSWORD
	from SERVICE_CONFIGURATION
		where CODE='ACRA'
GO
