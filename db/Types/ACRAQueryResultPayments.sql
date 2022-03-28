if (not exists (select * from sys.types where name='ACRAQueryResultPayments'))
	CREATE TYPE ACRAQueryResultPayments AS TABLE
	(
		YEAR	smallint	NOT NULL,
		MONTH	tinyint		NOT NULL,
		CUR		char(3)		NOT NULL,
		AMOUNT	money		NOT NULL
	)
GO
