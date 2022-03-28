if exists (select * from sys.objects where name='sp_SaveLoanSpecialistLoanTerm' and type='P')
	drop procedure sp_SaveLoanSpecialistLoanTerm
GO

create procedure sp_SaveLoanSpecialistLoanTerm(@CODE	char(3))
AS
	insert into LOAN_SPECIALIST_LOAN_TERM (CODE)
		values (@CODE)
GO
