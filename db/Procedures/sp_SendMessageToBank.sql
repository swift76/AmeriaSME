if exists (select * from sys.objects where name='sp_SendMessageToBank' and type='P')
	drop procedure dbo.sp_SendMessageToBank
GO

create procedure dbo.sp_SendMessageToBank(@APPLICATION_ID	uniqueidentifier)
AS
	update dbo.MESSAGE
	set IS_APPROVED = 1
	where APPLICATION_ID = @APPLICATION_ID and IS_APPROVED = 0
GO
