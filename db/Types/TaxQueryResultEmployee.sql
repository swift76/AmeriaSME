if (not exists (select * from sys.types where name='TaxQueryResultEmployee'))
	CREATE TYPE TaxQueryResultEmployee AS TABLE
	(
		PERIOD		varchar(20)	NULL,
		UPDATE_DATE	date		NULL,
		NUMBER		int			NOT NULL
	)
GO
