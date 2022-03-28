if exists (select * from sys.objects where name='sp_SaveCreditLineType' and type='P')
	drop procedure sp_SaveCreditLineType
GO

create procedure sp_SaveCreditLineType(@TYPE	nvarchar(200))
AS
	insert into ACRA_CREDIT_LINE_TYPE (TYPE)
		values (dbo.ahf_ANSI2Unicode(@TYPE))
GO
