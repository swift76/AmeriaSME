if exists (select * from sys.objects where name='sp_GetCachedNORQLegalFounderResponse' and type='P')
	drop procedure sp_GetCachedNORQLegalFounderResponse
GO

create procedure sp_GetCachedNORQLegalFounderResponse(@APPLICATION_ID	uniqueidentifier)
AS
	select NAME,DOCUMENT_NUMBER
	from NORQ_LEGAL_QUERY_RESULT_FOUNDER
	where APPLICATION_ID=@APPLICATION_ID
GO
