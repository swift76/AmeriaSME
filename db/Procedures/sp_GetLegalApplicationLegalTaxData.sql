﻿create or alter procedure sp_GetLegalApplicationLegalTaxData(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(COMPANY_TYPE) as COMPANY_TYPE
		,dbo.ahf_Unicode2ANSI(COMPANY_STATUS) as COMPANY_STATUS
		,dbo.ahf_Unicode2ANSI(TAX_TYPE) as TAX_TYPE
		,dbo.ahf_Unicode2ANSI(REGISTRATION_DISTRICT) as REGISTRATION_DISTRICT
		,dbo.ahf_Unicode2ANSI(REGISTRATION_COMMUNITY) as REGISTRATION_COMMUNITY
		,dbo.ahf_Unicode2ANSI(REGISTRATION_STREET) as REGISTRATION_STREET
		,dbo.ahf_Unicode2ANSI(REGISTRATION_BUILDING) as REGISTRATION_BUILDING
		,dbo.ahf_Unicode2ANSI(REGISTRATION_APARTMENT) as REGISTRATION_APARTMENT
		,isnull(dbo.ahf_Unicode2ANSI(CURRENT_DISTRICT),'') as CURRENT_DISTRICT
		,isnull(dbo.ahf_Unicode2ANSI(CURRENT_COMMUNITY),'') as CURRENT_COMMUNITY
		,isnull(dbo.ahf_Unicode2ANSI(CURRENT_STREET),'') as CURRENT_STREET
		,isnull(dbo.ahf_Unicode2ANSI(CURRENT_BUILDING),'') as CURRENT_BUILDING
		,isnull(dbo.ahf_Unicode2ANSI(CURRENT_APARTMENT),'') as CURRENT_APARTMENT
	from TAX_QUERY_RESULT
	where APPLICATION_ID=@APPLICATION_ID
GO