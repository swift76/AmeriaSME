if exists (select * from sys.objects where name='sp_SaveMessage' and type='P')
	drop procedure dbo.sp_SaveMessage
GO

create procedure dbo.sp_SaveMessage(@APPLICATION_ID		uniqueidentifier,
									@SCAN_TYPE			char(1))
AS
	insert into dbo.MESSAGE (
		APPLICATION_ID,
		SCAN_TYPE,
		FROM_BANK,
		IS_APPROVED
	)
	values (
		@APPLICATION_ID,
		@SCAN_TYPE,
		0,
		0
	)
GO
