if exists (select * from sys.objects where name='sp_GetApplicationUser' and type='P')
	drop procedure dbo.sp_GetApplicationUser
GO

create procedure dbo.sp_GetApplicationUser(@LOGIN	varchar(50))
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
	where LOGIN = @LOGIN
GO
