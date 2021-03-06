if exists (select * from sys.objects where name='SERVICE_CONFIGURATION' and type='U')
	drop table SERVICE_CONFIGURATION
GO

CREATE TABLE SERVICE_CONFIGURATION (
	CODE			char(4)			NOT NULL,
	URL				varchar(256)	NOT NULL,
	USER_NAME		varchar(40)		NOT NULL,
	USER_PASSWORD	varchar(40)		NOT NULL)
GO

CREATE UNIQUE CLUSTERED INDEX iSERVICE_CONFIGURATION1 ON SERVICE_CONFIGURATION(CODE)
GO
