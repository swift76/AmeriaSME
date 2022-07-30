create or alter procedure sp_GetMLPYConfigData
AS
	select URL,USER_NAME,USER_PASSWORD
	from SERVICE_CONFIGURATION
		where CODE='MLPY'
GO
