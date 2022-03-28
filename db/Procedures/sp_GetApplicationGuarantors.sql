if exists (select * from sys.objects where name='sp_GetApplicationGuarantors' and type='P')
	drop procedure dbo.sp_GetApplicationGuarantors
GO

create procedure dbo.sp_GetApplicationGuarantors (@APPLICATION_ID	uniqueidentifier)
AS
	select NAME, DOCUMENT_NUMBER
	from dbo.APPLICATION_GUARANTOR
	where APPLICATION_ID = @APPLICATION_ID
GO
