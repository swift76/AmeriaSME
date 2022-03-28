if exists (select * from sys.objects where name='sp_GetApplicationPhotoContent' and type='P')
	drop procedure dbo.sp_GetApplicationPhotoContent
GO

create procedure dbo.sp_GetApplicationPhotoContent(@ID	int)
AS
	SELECT CONTENT, FILE_NAME, IS_PLEDGE
	FROM APPLICATION_PHOTO
	WHERE ID = @ID
GO