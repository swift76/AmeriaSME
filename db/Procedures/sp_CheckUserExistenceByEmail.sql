if exists (select * from sys.objects where name='sp_CheckUserExistenceByEmail' and type='P')
	drop procedure dbo.sp_CheckUserExistenceByEmail
GO

create procedure dbo.sp_CheckUserExistenceByEmail (@EMAIL	varchar(70))
AS
	select ID
	from APPLICATION_USER
	where EMAIL = @EMAIL
GO
