create or alter procedure sp_GetUserRegistration(
	@PROCESS_ID	uniqueidentifier
)
AS
	select PROCESS_ID,
		VERIFICATION_CODE,
		MOBILE_PHONE,
		EMAIL,
		COMPANY_NAME,
		TAX_ID_NUMBER,
		HASH,
		TRY_COUNT,
		SMS_COUNT
	from USER_REGISTRATION
	where PROCESS_ID = @PROCESS_ID
GO
