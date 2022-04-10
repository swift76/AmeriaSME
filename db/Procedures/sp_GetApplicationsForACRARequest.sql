create or alter procedure sp_GetApplicationsForACRARequest
AS
	declare @ACRA_TRY_COUNT	tinyint
	select @ACRA_TRY_COUNT=convert(tinyint,VALUE)
		from SETTING
		where CODE='ACRA_TRY_COUNT'

	select a.ID,n.FIRST_NAME,n.LAST_NAME,n.BIRTH_DATE,n.PASSPORT_NUMBER,n.SOCIAL_CARD_NUMBER,n.ID_CARD_NUMBER
		,isnull(a.IMPORT_ID,0) as IMPORT_ID
		,dbo.f_IsCompanyTypeIE(e.TYPE) as IsIE
	from APPLICATION a
	join NORQ_QUERY_RESULT n
		on n.APPLICATION_ID=a.ID
	left join EREGISTER_QUERY_RESULT e
		on e.APPLICATION_ID=a.ID
	where a.STATUS_ID=5 and ACRA_TRY_COUNT<@ACRA_TRY_COUNT
	order by CREATION_DATE
GO
