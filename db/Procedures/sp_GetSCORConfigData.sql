if exists (select * from sys.objects where name='sp_GetSCORConfigData' and type='P')
	drop procedure sp_GetSCORConfigData
GO

create procedure sp_GetSCORConfigData
AS
	select URL,USER_NAME,USER_PASSWORD
	from SERVICE_CONFIGURATION
		where CODE='SCOR'
GO
