if exists (select * from sys.objects where name='USER_PASSWORD_RESET' and type='U')
	drop table dbo.USER_PASSWORD_RESET
GO

CREATE TABLE dbo.USER_PASSWORD_RESET(
    PROCESS_ID	uniqueidentifier	NOT NULL PRIMARY KEY,
	PHONE		varchar(20)			NOT NULL,
	HASH		varchar(1000)		NOT NULL,
	EXPIRES_ON	DATETIME			NOT NULL,
	TRY_COUNT	int					NOT NULL default 0
)
GO
