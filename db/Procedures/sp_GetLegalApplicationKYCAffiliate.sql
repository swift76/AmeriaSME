create or alter procedure sp_GetLegalApplicationKYCAffiliate(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(isnull(NAME,'')) as NAME,
		BIRTH_DATE,
		CLIENT_CODE,
		dbo.ahf_Unicode2ANSI(isnull(RELATION,'')) as RELATION
	from APPLICATION_KYC_AFFILIATE
	where APPLICATION_ID=@APPLICATION_ID
GO
