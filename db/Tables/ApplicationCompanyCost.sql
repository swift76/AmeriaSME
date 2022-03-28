if exists (select * from sys.objects where name='APPLICATION_COMPANY_COST' and type='U')
	drop table dbo.APPLICATION_COMPANY_COST
GO

CREATE TABLE dbo.APPLICATION_COMPANY_COST(
	ID				int					identity(1,1)	NOT NULL,
	APPLICATION_ID 	uniqueidentifier	NOT NULL,
	INDUSTRY_CODE	char(4)				NOT NULL,
	AMOUNT			money				NOT NULL,
	COMMENT			nvarchar(100)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION_COMPANY_COST1 ON APPLICATION_COMPANY_COST (ID)
GO

CREATE INDEX iAPPLICATION_COMPANY_COST2 ON APPLICATION_COMPANY_COST (APPLICATION_ID)
GO
