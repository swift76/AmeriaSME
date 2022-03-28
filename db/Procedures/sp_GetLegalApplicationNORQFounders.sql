create or alter procedure sp_GetLegalApplicationNORQFounders(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(NAME) as NAME,DOCUMENT_NUMBER
	from NORQ_LEGAL_QUERY_RESULT_FOUNDER
	where APPLICATION_ID=@APPLICATION_ID
GO
