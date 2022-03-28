if exists (select * from sys.objects where name='sp_SavePledgeType' and type='P')
	drop procedure sp_SavePledgeType
GO

create procedure sp_SavePledgeType(@CODE	char(1),
								   @NAME_AM	nvarchar(50),
								   @NAME_EN	varchar(50))
AS
	insert into PLEDGE_TYPE (
		CODE,
		NAME_AM,
		NAME_EN
	)
	values (
		@CODE,
		dbo.ahf_ANSI2Unicode(@NAME_AM),
		@NAME_EN
	)
GO
