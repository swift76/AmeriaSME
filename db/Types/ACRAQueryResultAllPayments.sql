if (not exists (select * from sys.types where name='ACRAQueryResultAllPayments'))
	CREATE TYPE ACRAQueryResultAllPayments AS TABLE
	(
		LOAN_ID	varchar(20)	NOT NULL,
		YEAR	smallint	NOT NULL,
		MONTH	tinyint		NOT NULL,
		CUR		char(3)		NOT NULL,
		AMOUNT	money		NOT NULL
	)
GO
