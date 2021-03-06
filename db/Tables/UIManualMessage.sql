if exists (select * from sys.objects where name='UI_MANUAL_MESSAGE' and type='U')
	drop table dbo.UI_MANUAL_MESSAGE
GO

CREATE TABLE dbo.UI_MANUAL_MESSAGE (
	ID 			int	IDENTITY(1,1)	NOT NULL,
	MESSAGE		nvarchar(100)		NOT NULL,
	UI_MESSAGE	nvarchar(500)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iUI_MANUAL_MESSAGE1 ON dbo.UI_MANUAL_MESSAGE(ID)
GO

CREATE INDEX iUI_MANUAL_MESSAGE2 ON dbo.UI_MANUAL_MESSAGE(MESSAGE)
GO
