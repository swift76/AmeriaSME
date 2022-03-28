if exists (select * from sys.objects where name='am0sp_GetSMEApplicationPrint' and type='P')
	drop procedure dbo.am0sp_GetSMEApplicationPrint
GO

create procedure dbo.am0sp_GetSMEApplicationPrint(@APPLICATION_ID	uniqueidentifier)
AS
	select CONTENT
	from AM0_SME_CONTRACT_PRINT
	where APPLICATION_ID = @APPLICATION_ID
GO
