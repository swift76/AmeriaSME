if exists (select * from sys.objects where name='MESSAGE' and type='U')
	drop table dbo.MESSAGE
GO

CREATE TABLE dbo.MESSAGE (
	ROW_ID 				int					identity(1, 1),
	APPLICATION_ID		uniqueidentifier	NOT NULL,
	DATE				datetime			NOT NULL default getdate(),
	SCAN_TYPE			char(1)				NOT NULL,
	TEXT				nvarchar(200)		NULL,
	FROM_BANK			bit					NOT NULL default 0,
	IS_APPROVED			bit					NOT NULL default 1,
)
GO

CREATE UNIQUE CLUSTERED INDEX iMESSAGE1 ON dbo.MESSAGE(ROW_ID)
GO
