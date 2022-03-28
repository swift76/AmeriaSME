if exists (select * from sys.objects where name='sp_DeleteApplicationPhoto' and type='P')
	drop procedure dbo.sp_DeleteApplicationPhoto
GO

create procedure dbo.sp_DeleteApplicationPhoto(@ID	int)
AS
	delete from APPLICATION_PHOTO
		where ID = @ID
GO
