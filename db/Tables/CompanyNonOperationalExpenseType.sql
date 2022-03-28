if exists (select * from sys.objects where name='COMPANY_NONOPERATIONAL_EXPENSE_TYPE' and type='U')
	drop table dbo.COMPANY_NONOPERATIONAL_EXPENSE_TYPE
GO

CREATE TABLE dbo.COMPANY_NONOPERATIONAL_EXPENSE_TYPE (
	CODE 	char(2)			NOT NULL,
	NAME_AM	nvarchar(100)	NOT NULL,
	NAME_EN varchar(100)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iCOMPANY_NONOPERATIONAL_EXPENSE_TYPE1 ON dbo.COMPANY_NONOPERATIONAL_EXPENSE_TYPE(CODE)
GO
