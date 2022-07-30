if exists (select * from sys.objects where name='LOAN_USAGE' and type='U')
	drop table dbo.LOAN_USAGE
GO

CREATE TABLE dbo.LOAN_USAGE (
	CODE 	char(2)			NOT NULL,
	NAME_AM	nvarchar(100)	NOT NULL,
	NAME_EN varchar(100)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iLOAN_USAGE1 ON dbo.LOAN_USAGE(CODE)
GO
