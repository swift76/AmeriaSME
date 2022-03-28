create or alter procedure sp_GetServiceTimeout(@ID tinyint)
AS
	select TIMEOUT_SECOND
	from SERVICE_TIMEOUT
		where ID=@ID
GO
