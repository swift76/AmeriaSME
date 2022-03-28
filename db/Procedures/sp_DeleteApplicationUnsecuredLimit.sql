if exists (select * from sys.objects where name='sp_DeleteApplicationUnsecuredLimit' and type='P')
	drop procedure sp_DeleteApplicationUnsecuredLimit
GO

create procedure sp_DeleteApplicationUnsecuredLimit
AS
	delete from APPLICATION_UNSECURED_LIMIT
GO
