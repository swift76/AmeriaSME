if exists (select * from sys.objects where name='LOAN_SETTING' and type='U')
	drop table dbo.LOAN_SETTING
GO

CREATE TABLE dbo.LOAN_SETTING (
	REPEAT_COUNT 		int		NOT NULL,
	REPEAT_DAY_COUNT 	tinyint	NOT NULL,
	EXPIRE_DAY_COUNT	tinyint	NOT NULL,
	CONTACT_DAY_COUNT	tinyint	NOT NULL,
	LS_EXPIRE_DAY_COUNT	tinyint	NULL)
GO
