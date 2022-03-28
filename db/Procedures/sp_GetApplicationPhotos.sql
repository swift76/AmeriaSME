if exists (select * from sys.objects where name='sp_GetApplicationPhotos' and type='P')
	drop procedure dbo.sp_GetApplicationPhotos
GO

create procedure dbo.sp_GetApplicationPhotos(@APPLICATION_ID	uniqueidentifier)
AS
	SELECT ID, FILE_NAME, IS_PLEDGE, CREATION_DATE
	FROM   dbo.APPLICATION_PHOTO
	WHERE  APPLICATION_ID = @APPLICATION_ID
GO
