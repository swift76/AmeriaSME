create or alter procedure sp_SetTryUserRegistration(
	@PROCESS_ID uniqueidentifier
)
AS
	update USER_REGISTRATION
	set TRY_COUNT = TRY_COUNT+1
	where PROCESS_ID = @PROCESS_ID
GO
