if exists (select * from sys.objects where name='sp_GetLoanSpecialistLoanTerms' and type='P')
	drop procedure dbo.sp_GetLoanSpecialistLoanTerms
GO

create procedure dbo.sp_GetLoanSpecialistLoanTerms
AS
	select
		CODE
	from dbo.LOAN_SPECIALIST_LOAN_TERM
GO
