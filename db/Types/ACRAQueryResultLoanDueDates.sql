if (not exists (select * from sys.types where name='ACRAQueryResultLoanDueDates'))
	CREATE TYPE ACRAQueryResultLoanDueDates AS TABLE
	(
		LOAN_ID	varchar(20)	NOT NULL,
		YEAR	smallint	NOT NULL,
		MONTH	tinyint		NOT NULL,
		COUNT	int			NOT NULL
	)
GO
