if exists (select * from sys.objects where name='APPLICATION_STATUS' and type='U')
	drop table APPLICATION_STATUS
GO

CREATE TABLE APPLICATION_STATUS (
	ID	 		smallint		NOT NULL,
	UI_NAME_AM	nvarchar(80)	NULL,
	UI_NAME_EN	varchar(80)		NULL,
	NAME_AM		nvarchar(80)	NOT NULL,
	NAME_EN		varchar(80)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION_STATUS1 ON APPLICATION_STATUS(ID)
GO