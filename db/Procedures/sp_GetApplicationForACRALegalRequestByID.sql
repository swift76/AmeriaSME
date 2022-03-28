create or alter procedure sp_GetApplicationForACRALegalRequestByID(@ID	uniqueidentifier)
AS
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
	where a.ID=@ID and a.STATUS_ID=3
GO
