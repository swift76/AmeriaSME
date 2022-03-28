create or alter procedure sp_GetLegalApplicationKYCOtherBankInfo(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(isnull(NAME,'')) as NAME,
		dbo.ahf_Unicode2ANSI(isnull(ACCOUNT_TYPE,'')) as ACCOUNT_TYPE
	from APPLICATION_KYC_OTHER_BANK_INFO
	where APPLICATION_ID=@APPLICATION_ID
GO
