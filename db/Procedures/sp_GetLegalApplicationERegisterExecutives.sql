create or alter procedure sp_GetLegalApplicationERegisterExecutives(@APPLICATION_ID	uniqueidentifier)
AS
	select isnull(COUNTRY,'') as COUNTRY,
		isnull(dbo.ahf_Unicode2ANSI(DISTRICT),'') as DISTRICT,
		isnull(dbo.ahf_Unicode2ANSI(COMMUNITY),'') as COMMUNITY,
		isnull(dbo.ahf_Unicode2ANSI(STREET),'') as STREET,
		isnull(dbo.ahf_Unicode2ANSI(BUILDING),'') as BUILDING,
		isnull(dbo.ahf_Unicode2ANSI(APARTMENT),'') as APARTMENT,
		isnull(dbo.ahf_Unicode2ANSI(ADDRESS),'') as ADDRESS,
		isnull(POSTAL_CODE,'') as POSTAL_CODE,
		isnull(dbo.ahf_Unicode2ANSI(POSITION),'') as POSITION,
		isnull(PASSPORT_NUMBER,'') as PASSPORT_NUMBER,
		PASSPORT_DATE,
		PASSPORT_EXPIRY_DATE,
		isnull(PASSPORT_BY,'') as PASSPORT_BY,
		isnull(SOCIAL_CARD_NUMBER,'') as SOCIAL_CARD_NUMBER,
		BIRTH_DATE,
		GENDER,
		isnull(CITIZENSHIP_CODE,'') as CITIZENSHIP_CODE,
		isnull(dbo.ahf_Unicode2ANSI(FIRST_NAME),'') as FIRST_NAME,
		isnull(dbo.ahf_Unicode2ANSI(LAST_NAME),'') as LAST_NAME,
		isnull(dbo.ahf_Unicode2ANSI(PATRONYMIC_NAME),'') as PATRONYMIC_NAME,
		isnull(dbo.ahf_Unicode2ANSI(FULL_NAME),'') as FULL_NAME
	from EREGISTER_QUERY_RESULT_EXECUTIVE
	where APPLICATION_ID=@APPLICATION_ID
GO
