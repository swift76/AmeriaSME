if exists (select * from sys.objects where name='INDUSTRY_PRODUCT' and type='U')
	drop table dbo.INDUSTRY_PRODUCT
GO

CREATE TABLE dbo.INDUSTRY_PRODUCT (
	CODE 	char(2)			NOT NULL,
	NAME_AM	nvarchar(100)	NOT NULL,
	NAME_EN varchar(100)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iINDUSTRY_PRODUCT1 ON dbo.INDUSTRY_PRODUCT(CODE)
GO