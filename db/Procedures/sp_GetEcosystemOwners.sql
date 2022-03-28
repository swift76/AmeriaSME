create or alter procedure sp_GetEcosystemOwners(@APPLICATION_ID	uniqueidentifier)
AS
	select ID,
		isnull(COUNTRY,'') as COUNTRY,
		isnull(dbo.ahf_Unicode2ANSI(DISTRICT),'') as DISTRICT,
		isnull(dbo.ahf_Unicode2ANSI(COMMUNITY),'') as COMMUNITY,
		isnull(dbo.ahf_Unicode2ANSI(STREET),'') as STREET,
		isnull(dbo.ahf_Unicode2ANSI(BUILDING),'') as BUILDING,
		isnull(dbo.ahf_Unicode2ANSI(APARTMENT),'') as APARTMENT,

		isnull(CURRENT_COUNTRY,'') as CURRENT_COUNTRY,
		isnull(dbo.ahf_Unicode2ANSI(CURRENT_DISTRICT),'') as CURRENT_DISTRICT,
		isnull(dbo.ahf_Unicode2ANSI(CURRENT_COMMUNITY),'') as CURRENT_COMMUNITY,
		isnull(dbo.ahf_Unicode2ANSI(CURRENT_STREET),'') as CURRENT_STREET,
		isnull(dbo.ahf_Unicode2ANSI(CURRENT_BUILDING),'') as CURRENT_BUILDING,
		isnull(dbo.ahf_Unicode2ANSI(CURRENT_APARTMENT),'') as CURRENT_APARTMENT,

		isnull(PASSPORT_TYPE,'') as PASSPORT_TYPE,
		isnull(PASSPORT_NUMBER,'') as PASSPORT_NUMBER,
		PASSPORT_DATE,
		PASSPORT_EXPIRY_DATE,
		isnull(PASSPORT_BY,'') as PASSPORT_BY,

		isnull(SOCIAL_CARD_NUMBER,'') as SOCIAL_CARD_NUMBER,
		BIRTH_DATE,
		GENDER,
		isnull(CITIZENSHIP_CODE,'AM') as CITIZENSHIP_CODE,

		isnull(dbo.ahf_Unicode2ANSI(FIRST_NAME),'') as FIRST_NAME,
		isnull(dbo.ahf_Unicode2ANSI(LAST_NAME),'') as LAST_NAME,
		isnull(dbo.ahf_Unicode2ANSI(PATRONYMIC_NAME),'') as PATRONYMIC_NAME,

		isnull(FIRST_NAME_EN,'') as FIRST_NAME_EN,
		isnull(LAST_NAME_EN,'') as LAST_NAME_EN,

		isnull(SHARE_INTEREST,0) as SHARE_INTEREST
	from ECOSYSTEM_OWNER
	where APPLICATION_ID=@APPLICATION_ID
		and CLIENT_CODE is null
GO
