if exists (select * from sys.objects where name='sp_CheckUserExistenceByLogin' and type='P')
	drop procedure dbo.sp_CheckUserExistenceByLogin
GO

create procedure dbo.sp_CheckUserExistenceByLogin(@LOGIN	varchar(50))
AS
	select ID
	from dbo.APPLICATION_USER
	where LOGIN = @LOGIN
		-- and USER_ROLE_ID=3 TODO: do we need this?
GO
