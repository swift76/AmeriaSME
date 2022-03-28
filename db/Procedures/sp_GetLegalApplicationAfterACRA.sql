﻿create or alter procedure sp_GetLegalApplicationAfterACRA(@ID	uniqueidentifier)
AS
	select isnull(a.ISN,-1) as ISN
		,a.LOAN_TYPE_ID
		,a.INITIAL_AMOUNT,a.CURRENCY_CODE
		,a.FIRST_NAME_EN,a.LAST_NAME_EN
		,a.SOCIAL_CARD_NUMBER,a.TAX_ID_NUMBER
		,dbo.ahf_Unicode2ANSI(a.COMPANY_NAME) as COMPANY_NAME
		,isnull(a.EMAIL,'') as EMAIL
		,isnull(a.COMPANY_EMAIL,'') as COMPANY_EMAIL
		,isnull(a.MOBILE_PHONE,'') as MOBILE_PHONE
		,isnull(a.FACEBOOK,'') as FACEBOOK
		,isnull(a.WEBSITE,'') as WEBSITE
		,isnull(a.ACTIVITY_CODE,'') as ACTIVITY_CODE
		,isnull(a.FACTUAL_INDUSTRY_CODE,'') as FACTUAL_INDUSTRY_CODE
		,a.ANNUAL_TURNOVER
		,isnull(a.CURRENT_COUNTRY_CODE,'') as CURRENT_COUNTRY_CODE
		,isnull(a.CURRENT_STATE_CODE,'') as CURRENT_STATE_CODE
		,isnull(a.CURRENT_CITY_CODE,'') as CURRENT_COMMUNITY
		,isnull(dbo.ahf_Unicode2ANSI(a.CURRENT_STREET),'') as CURRENT_STREET
		,isnull(dbo.ahf_Unicode2ANSI(a.CURRENT_BUILDNUM),'') as CURRENT_BUILDNUM
		,isnull(dbo.ahf_Unicode2ANSI(a.CURRENT_APARTMENT),'') as CURRENT_APARTMENT
		,isnull(a.INDIVIDUAL_COUNTRY_CODE,'') as INDIVIDUAL_COUNTRY_CODE
		,isnull(a.INDIVIDUAL_STATE_CODE,'') as INDIVIDUAL_STATE_CODE
		,isnull(a.INDIVIDUAL_CITY_CODE,'') as INDIVIDUAL_COMMUNITY
		,isnull(dbo.ahf_Unicode2ANSI(a.INDIVIDUAL_STREET),'') as INDIVIDUAL_STREET
		,isnull(dbo.ahf_Unicode2ANSI(a.INDIVIDUAL_BUILDNUM),'') as INDIVIDUAL_BUILDNUM
		,isnull(dbo.ahf_Unicode2ANSI(a.INDIVIDUAL_APARTMENT),'') as INDIVIDUAL_APARTMENT
		,isnull(dbo.ahf_Unicode2ANSI(nl.NAME),'') as NORQ_LEGAL_NAME
		,isnull(dbo.ahf_Unicode2ANSI(nl.TYPE),'') as NORQ_LEGAL_TYPE
		,isnull(dbo.ahf_Unicode2ANSI(nl.ADDRESS),'') as NORQ_LEGAL_ADDRESS
		,nl.EMPLOYEE_COUNT as NORQ_LEGAL_EMPLOYEE_COUNT
		,nl.REGISTRATION_DATE as NORQ_LEGAL_REGISTRATION_DATE,nl.REGISTRATION_CODE as NORQ_LEGAL_REGISTRATION_CODE
		,er.COUNTRY as ER_COUNTRY,dbo.ahf_Unicode2ANSI(er.DISTRICT) as ER_DISTRICT,dbo.ahf_Unicode2ANSI(er.COMMUNITY) as ER_COMMUNITY
		,dbo.ahf_Unicode2ANSI(er.STREET) as ER_STREET,dbo.ahf_Unicode2ANSI(er.BUILDING) as ER_BUILDING,dbo.ahf_Unicode2ANSI(er.APARTMENT) as ER_APARTMENT
		,dbo.ahf_Unicode2ANSI(er.ADDRESS) as ER_ADDRESS,er.POSTAL_CODE as ER_POSTAL_CODE
		,dbo.ahf_Unicode2ANSI(er.CERTIFICATE_CODE) as ER_CERTIFICATE_CODE
		,er.REGISTRATION_DATE as ER_REGISTRATION_DATE,er.REGISTRATION_CODE as ER_REGISTRATION_CODE
		,dbo.ahf_Unicode2ANSI(er.TYPE) as ER_TYPE,er.IS_ACTIVE as ER_IS_ACTIVE,er.INDUSTRY_CODE as ER_INDUSTRY_CODE
		,dbo.ahf_Unicode2ANSI(er.NAME_AM) as ER_NAME_AM,NAME_EN as ER_NAME_EN
		,dbo.f_GetAge(n.BIRTH_DATE) as AGE,dbo.ahf_Unicode2ANSI(n.FIRST_NAME) as NORQ_FIRST_NAME,dbo.ahf_Unicode2ANSI(n.LAST_NAME) as NORQ_LAST_NAME,dbo.ahf_Unicode2ANSI(n.PATRONYMIC_NAME) as NORQ_PATRONYMIC_NAME,n.BIRTH_DATE,n.GENDER
		,dbo.ahf_Unicode2ANSI(n.DISTRICT) as DISTRICT,dbo.ahf_Unicode2ANSI(n.COMMUNITY) as COMMUNITY,dbo.ahf_Unicode2ANSI(n.STREET) as STREET,dbo.ahf_Unicode2ANSI(n.BUILDING) as BUILDING,dbo.ahf_Unicode2ANSI(n.APARTMENT) as APARTMENT,dbo.ahf_Unicode2ANSI(n.ADDRESS) as ADDRESS
		,isnull(n.PASSPORT_NUMBER,'') as PASSPORT_NUMBER,n.PASSPORT_DATE,n.PASSPORT_EXPIRY_DATE,n.PASSPORT_BY
		,isnull(n.BIOMETRIC_PASSPORT_NUMBER,'') as BIOMETRIC_PASSPORT_NUMBER,n.BIOMETRIC_PASSPORT_ISSUE_DATE,n.BIOMETRIC_PASSPORT_EXPIRY_DATE,n.BIOMETRIC_PASSPORT_ISSUED_BY
		,isnull(n.ID_CARD_NUMBER,'') as ID_CARD_NUMBER,n.ID_CARD_ISSUE_DATE,n.ID_CARD_EXPIRY_DATE,n.ID_CARD_ISSUED_BY
		,n.SOCIAL_CARD_NUMBER as NORQ_SOCIAL_CARD_NUMBER,n.FEE
		,c.FICO_SCORE
		,a.NORQ_LEGAL_TRY_COUNT,a.ACRA_LEGAL_TRY_COUNT,a.EREGISTER_TRY_COUNT,a.NORQ_TRY_COUNT,a.ACRA_TRY_COUNT
		,isnull(u.LOGIN,'') as LOGIN
	from APPLICATION a with (NOLOCK)
	join NORQ_LEGAL_QUERY_RESULT nl with (NOLOCK)
		on nl.APPLICATION_ID=a.ID
	join EREGISTER_QUERY_RESULT er with (NOLOCK)
		on er.APPLICATION_ID=a.ID
	join NORQ_QUERY_RESULT n with (NOLOCK)
		on n.APPLICATION_ID=a.ID
	join ACRA_QUERY_RESULT c with (NOLOCK)
		on c.APPLICATION_ID=a.ID
	left join APPLICATION_USER u
		on u.ID=a.LOAN_SPECIALIST_ID
	where a.ID=@ID
GO
