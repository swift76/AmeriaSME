if exists (select * from sys.objects where name='SCAN_MAX_COUNT' and type='U')
	drop table dbo.SCAN_MAX_COUNT
GO

CREATE TABLE dbo.SCAN_MAX_COUNT (
	CODE		char(1)			NOT NULL,
	VALUE		char(2)			NOT NULL,
	DESCRIPTION	nvarchar(150)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iSCAN_MAX_COUNT1 ON dbo.SCAN_MAX_COUNT(CODE)
GO
