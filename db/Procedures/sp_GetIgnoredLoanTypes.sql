if exists (select * from sys.objects where name='sp_GetIgnoredLoanTypes' and type='P')
	drop procedure sp_GetIgnoredLoanTypes
GO

create procedure sp_GetIgnoredLoanTypes
AS
	select TYPE from ACRA_IGNORED_LOAN_TYPE
GO
