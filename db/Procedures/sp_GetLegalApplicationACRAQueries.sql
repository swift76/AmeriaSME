create or alter procedure sp_GetLegalApplicationACRAQueries(@APPLICATION_ID	uniqueidentifier)
AS
	select DATE,dbo.ahf_Unicode2ANSI(BANK_NAME) as BANK_NAME
	from ACRA_QUERY_RESULT_QUERIES
	where APPLICATION_ID=@APPLICATION_ID
	order by DATE
GO
