if exists (select * from sys.objects where name='sp_GetApplicationUserByID' and type='P')
	drop procedure dbo.sp_GetApplicationUserByID
GO

create procedure dbo.sp_GetApplicationUserByID(@ID	int)
AS
	select	ID,
			LOGIN,
			CREATE_DATE,
			PASSWORD_EXPIRY_DATE,
			MOBILE_PHONE,
			EMAIL,
			CLOSE_DATE,
			USER_STATE_ID,
			USER_ROLE_ID
	from dbo.APPLICATION_USER
	where ID = @ID
GO
