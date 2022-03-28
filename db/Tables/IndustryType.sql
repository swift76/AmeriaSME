if exists (select * from sys.objects where name='INDUSTRY_TYPE' and type='U')
	drop table dbo.INDUSTRY_TYPE
GO

CREATE TABLE dbo.INDUSTRY_TYPE (
	CODE 	char(4)			NOT NULL,
	NAME_AM	nvarchar(100)	NOT NULL,
	NAME_EN varchar(100)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iINDUSTRY_TYPE1 ON dbo.INDUSTRY_TYPE(CODE)
GO
