if (not exists (select * from sys.types where name='TaxQueryResultData'))
	CREATE TYPE TaxQueryResultData AS TABLE
	(
		TYPE		nvarchar(200)	NULL,
		PERIOD		varchar(20)		NULL,
		UPDATE_DATE	date			NULL,
		AMOUNT		money			NOT NULL,
		OUTSTANDING	money			NULL,
		FINE		money			NULL,
		OVERPAYMENT	money			NULL
	)
GO
