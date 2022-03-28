if exists (select * from sys.objects where name='sp_GetMessages' and type='P')
	drop procedure dbo.sp_GetMessages
GO

create procedure dbo.sp_GetMessages(@APPLICATION_ID		uniqueidentifier)
AS
	select	APPLICATION_ID,
			DATE,
			SCAN_TYPE,
			TEXT,
			IS_APPROVED
	from dbo.MESSAGE
	where APPLICATION_ID = @APPLICATION_ID and FROM_BANK = 1
	order by DATE desc
GO
