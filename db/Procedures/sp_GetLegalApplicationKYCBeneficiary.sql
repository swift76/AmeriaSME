create or alter procedure sp_GetLegalApplicationKYCBeneficiary(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(isnull(NAME,'')) as NAME,
		dbo.ahf_Unicode2ANSI(isnull(ID_NUMBER,'')) as ID_NUMBER
	from APPLICATION_KYC_BENEFICIARY
	where APPLICATION_ID=@APPLICATION_ID
GO
