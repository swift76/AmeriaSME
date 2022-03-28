create or alter procedure dbo.sp_StartUserRegistration(
	@PROCESS_ID				uniqueidentifier,
	@VERIFICATION_CODE		varchar(6),
	@COMPANY_NAME			varchar(100),
	@TAX_ID_NUMBER			char(8),
	@MOBILE_PHONE			char(11),
	@EMAIL					varchar(50),
	@HASH					varchar(1000)
)
AS
	insert into dbo.USER_REGISTRATION (
		PROCESS_ID,
		VERIFICATION_CODE,
		MOBILE_PHONE,
		EMAIL,
		COMPANY_NAME,
		TAX_ID_NUMBER,
		HASH
	)
	values (
		@PROCESS_ID,
		@VERIFICATION_CODE,
		@MOBILE_PHONE,
		@EMAIL,
		@COMPANY_NAME,
		@TAX_ID_NUMBER,
		@HASH
	)
GO
