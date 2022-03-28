if exists (select * from sys.objects where name='sp_StartUserPasswordReset' and type='P')
	drop procedure dbo.sp_StartUserPasswordReset
GO

create procedure dbo.sp_StartUserPasswordReset (
	@PROCESS_ID		uniqueidentifier,
	@PHONE			varchar(15),
	@HASH			varchar(1000)
)

AS
	insert into dbo.USER_PASSWORD_RESET
		(PROCESS_ID, PHONE, HASH, EXPIRES_ON)
	values
		(@PROCESS_ID, @PHONE, @HASH, DATEADD(MINUTE, 30, GETDATE()))
GO
