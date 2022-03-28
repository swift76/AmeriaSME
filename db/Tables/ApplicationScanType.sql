if exists (select * from sys.objects where name='APPLICATION_SCAN_TYPE' and type='U')
	drop table dbo.APPLICATION_SCAN_TYPE
GO

CREATE TABLE dbo.APPLICATION_SCAN_TYPE (
	CODE 	char(3)			NOT NULL,
	NAME_AM	nvarchar(100)	NOT NULL,
	NAME_EN varchar(100)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION_SCAN_TYPE1 ON dbo.APPLICATION_SCAN_TYPE(CODE)
GO
