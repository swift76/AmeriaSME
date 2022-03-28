create or alter procedure sp_GetLoanSpecialistApplicationPledgers(@ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(isnull(NAME,'')) as NAME,
		DOCUMENT_NUMBER
	from APPLICATION_PLEDGER
	where APPLICATION_ID=@ID
GO
