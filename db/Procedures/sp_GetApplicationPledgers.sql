if exists (select * from sys.objects where name='sp_GetApplicationPledgers' and type='P')
	drop procedure dbo.sp_GetApplicationPledgers
GO

create procedure dbo.sp_GetApplicationPledgers (@APPLICATION_ID	uniqueidentifier)
AS
	select NAME, DOCUMENT_NUMBER
	from dbo.APPLICATION_PLEDGER
	where APPLICATION_ID = @APPLICATION_ID
GO
