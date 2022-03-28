if exists (select * from sys.objects where name='ACTIVITY' and type='U')
	drop table ACTIVITY
GO

CREATE TABLE ACTIVITY (
	CODE 	char(2)			NOT NULL,
	NAME_AM	nvarchar(50)	NOT NULL,
	NAME_EN varchar(50)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iACTIVITY1 ON ACTIVITY(CODE)
GO
