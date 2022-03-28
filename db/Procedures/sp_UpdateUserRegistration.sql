create or alter procedure sp_UpdateUserRegistration(
	@PROCESS_ID			uniqueidentifier,
	@VERIFICATION_CODE	varchar(6))
AS
	if exists (select *
			   from USER_REGISTRATION
			   where PROCESS_ID = @PROCESS_ID)
		update USER_REGISTRATION
		set	VERIFICATION_CODE = @VERIFICATION_CODE,
			SMS_COUNT = SMS_COUNT+1
		where PROCESS_ID = @PROCESS_ID
GO
