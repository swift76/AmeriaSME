if exists (select * from sys.objects where name='APPLICATION_COMPANY_OTHER_STATISTICS' and type='U')
	drop table dbo.APPLICATION_COMPANY_OTHER_STATISTICS
GO

CREATE TABLE dbo.APPLICATION_COMPANY_OTHER_STATISTICS(
	APPLICATION_ID 						uniqueidentifier	NOT NULL,
	COMPANY_OTHER_STATISTICS_TYPE_CODE	char(2)				NOT NULL,
	AMOUNT								money				NOT NULL,
	COMMENT								nvarchar(100)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION_COMPANY_OTHER_STATISTICS1 ON APPLICATION_COMPANY_OTHER_STATISTICS (APPLICATION_ID,COMPANY_OTHER_STATISTICS_TYPE_CODE)
GO