if exists (select * from sys.objects where name='sp_SaveIgnoredLoanType' and type='P')
	drop procedure sp_SaveIgnoredLoanType
GO

create procedure sp_SaveIgnoredLoanType(@TYPE	nvarchar(200))
AS
	insert into ACRA_IGNORED_LOAN_TYPE (TYPE)
		values (dbo.ahf_ANSI2Unicode(@TYPE))
GO
