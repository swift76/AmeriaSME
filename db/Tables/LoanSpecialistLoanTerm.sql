if exists (select * from sys.objects where name='LOAN_SPECIALIST_LOAN_TERM' and type='U')
	drop table dbo.LOAN_SPECIALIST_LOAN_TERM
GO

CREATE TABLE dbo.LOAN_SPECIALIST_LOAN_TERM (
	CODE char(3)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iLOAN_SPECIALIST_LOAN_TERM1 ON dbo.LOAN_SPECIALIST_LOAN_TERM(CODE)
GO
