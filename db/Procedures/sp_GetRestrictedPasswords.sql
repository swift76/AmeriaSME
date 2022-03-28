create or alter procedure sp_GetRestrictedPasswords
AS
	select PASSWORD from RESTRICTED_PASSWORD
GO
