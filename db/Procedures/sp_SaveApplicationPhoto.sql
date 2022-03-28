if exists (select * from sys.objects where name='sp_SaveApplicationPhoto' and type='P')
	drop procedure dbo.sp_SaveApplicationPhoto
GO

create procedure dbo.sp_SaveApplicationPhoto(@APPLICATION_ID	uniqueidentifier,
											 @FILE_NAME			nvarchar(250),
											 @CONTENT			varbinary(max),
											 @IS_PLEDGE			bit,
											 @ID				int	OUTPUT)
AS
	insert into APPLICATION_PHOTO
		(APPLICATION_ID, FILE_NAME, CONTENT, IS_PLEDGE)
	values
		(@APPLICATION_ID,@FILE_NAME, @CONTENT, @IS_PLEDGE)
	set @ID=SCOPE_IDENTITY()
GO

