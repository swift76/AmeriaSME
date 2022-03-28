if exists (select * from sys.objects where name='LOAN_PURPOSE' and type='U')
	drop table dbo.LOAN_PURPOSE
GO

CREATE TABLE dbo.LOAN_PURPOSE (
	CODE 			char(1)			NOT NULL,
	NAME_AM			nvarchar(50)	NOT NULL,
	NAME_EN			varchar(50)		NOT NULL,
	DESCRIPTION_AM	nvarchar(max)	NOT NULL,
	DESCRIPTION_EN	varchar(max)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iLOAN_PURPOSE1 ON dbo.LOAN_PURPOSE(CODE)
GO
