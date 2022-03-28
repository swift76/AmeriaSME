if exists (select * from sys.objects where name='sp_SaveMessageFromBank' and type='P')
	drop procedure dbo.sp_SaveMessageFromBank
GO

create procedure dbo.sp_SaveMessageFromBank(@APPLICATION_ID	uniqueidentifier,
											@SCAN_TYPE		char(1),
											@TEXT			varchar(200))
AS
	insert into dbo.MESSAGE (
		APPLICATION_ID,
		SCAN_TYPE,
		TEXT,
		FROM_BANK,
		IS_APPROVED
	)
	values (
		@APPLICATION_ID,
		@SCAN_TYPE,
		dbo.ahf_ANSI2Unicode(@TEXT),
		1,
		0
	)
GO
