create or alter procedure sp_GetLoanSpecialistApplicationGuarantors(@ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(isnull(NAME,'')) as NAME,
		DOCUMENT_NUMBER
	from APPLICATION_GUARANTOR
	where APPLICATION_ID=@ID
GO
