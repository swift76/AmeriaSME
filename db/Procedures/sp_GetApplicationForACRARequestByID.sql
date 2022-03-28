create or alter procedure sp_GetApplicationForACRARequestByID(@ID	uniqueidentifier)
AS
	select a.ID,n.FIRST_NAME,n.LAST_NAME,n.BIRTH_DATE,n.PASSPORT_NUMBER,n.SOCIAL_CARD_NUMBER,n.ID_CARD_NUMBER
		,isnull(a.IMPORT_ID,0) as IMPORT_ID
	from APPLICATION a
	join NORQ_QUERY_RESULT n
		on n.APPLICATION_ID=a.ID
	where a.ID=@ID and a.STATUS_ID=5
GO
