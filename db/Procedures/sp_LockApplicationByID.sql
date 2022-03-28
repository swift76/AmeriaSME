if exists (select * from sys.objects where name='sp_LockApplicationByID' and type='P')
	drop procedure sp_LockApplicationByID
GO

create procedure sp_LockApplicationByID(@ID						uniqueidentifier,
										@APPLICATION_STATUS_ID	smallint)
AS
	select ID
		from APPLICATION with (UPDLOCK)
		where ID=@ID and STATUS_ID=@APPLICATION_STATUS_ID
GO
