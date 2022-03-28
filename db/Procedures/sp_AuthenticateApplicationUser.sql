if exists (select * from sys.objects where name='sp_AuthenticateApplicationUser' and type='P')
	drop procedure dbo.sp_AuthenticateApplicationUser
GO

create procedure dbo.sp_AuthenticateApplicationUser(@LOGIN			varchar(50),
													@HASH			varchar(1000),
													@USER_ROLE_ID	tinyint = null)
AS
	select ID,
		LOGIN,
		CREATE_DATE,
		MOBILE_PHONE,
		EMAIL,
		PASSWORD_EXPIRY_DATE,
		CLOSE_DATE,
		USER_ROLE_ID,
		USER_STATE_ID
	from dbo.APPLICATION_USER
	where upper(LOGIN) = upper(@LOGIN) and
		  HASH = @HASH and
		  USER_STATE_ID = 1 and
		  USER_ROLE_ID = isnull(@USER_ROLE_ID,USER_ROLE_ID)
GO
