if exists (select * from sys.objects where name='USER_REGISTRATION' and type='U')
	drop table dbo.USER_REGISTRATION
GO

CREATE TABLE dbo.USER_REGISTRATION (
	PROCESS_ID			uniqueidentifier	NOT NULL PRIMARY KEY,
	VERIFICATION_CODE	varchar(6)			NOT NULL,
	MOBILE_PHONE		varchar(20)			NOT NULL,
	EMAIL				varchar(70)			NOT NULL,
	COMPANY_NAME		varchar(100)		NOT NULL,
	TAX_ID_NUMBER		char(8)				NOT NULL,
	HASH				varchar(1000)		NOT NULL,
	TRY_COUNT			int					NOT NULL default 0,
	SMS_COUNT			int					NOT NULL default 1
)
GO
