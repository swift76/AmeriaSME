create or alter procedure sp_GetApplicationsForACRALegalRequest
AS
	declare @ACRA_TRY_COUNT	tinyint
	select @ACRA_TRY_COUNT=convert(tinyint,VALUE)
		from SETTING
		where CODE='ACRA_TRY_COUNT'

	select a.ID,a.TAX_ID_NUMBER,
		case
			when rtrim(isnull(n.NAME,''))='' then isnull(e.NAME_AM,'')
			else n.NAME
		end as NAME
		,isnull(a.IMPORT_ID,0) as IMPORT_ID
	from APPLICATION a
	join NORQ_LEGAL_QUERY_RESULT n
		on n.APPLICATION_ID=a.ID
	left join EREGISTER_QUERY_RESULT e
		on e.APPLICATION_ID=a.ID
	where a.STATUS_ID=3 and a.ACRA_LEGAL_TRY_COUNT<@ACRA_TRY_COUNT
	order by CREATION_DATE
GO
