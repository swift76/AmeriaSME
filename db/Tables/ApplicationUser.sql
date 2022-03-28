if exists (select * from sys.objects where name='APPLICATION_USER' and type='U')
	drop table APPLICATION_USER
GO

CREATE TABLE APPLICATION_USER(
	ID						int				identity(1000000,1),
	LOGIN					varchar(50)		NOT NULL,
	HASH					varchar(1000)	NOT NULL,
	CREATE_DATE				datetime		NOT NULL default getdate(),
	PASSWORD_EXPIRY_DATE	date			NULL,
	MOBILE_PHONE			varchar(20)		NULL,
	EMAIL					varchar(70)		NOT NULL,
	CLOSE_DATE				datetime		NULL,
	USER_STATE_ID			tinyint			NOT NULL,
	USER_ROLE_ID			tinyint			NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION_USER1 ON APPLICATION_USER (ID)
GO
