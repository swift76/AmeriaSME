if exists (select * from sys.objects where name='PLEDGE_TYPE' and type='U')
	drop table dbo.PLEDGE_TYPE
GO

CREATE TABLE dbo.PLEDGE_TYPE (
	CODE 	char(1)			NOT NULL,
	NAME_AM	nvarchar(50)	NOT NULL,
	NAME_EN	varchar(50)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iPLEDGE_TYPE1 ON dbo.PLEDGE_TYPE(CODE)
GO
