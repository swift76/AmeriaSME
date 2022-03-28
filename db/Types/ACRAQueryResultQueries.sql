if (not exists (select * from sys.types where name='ACRAQueryResultQueries'))
	CREATE TYPE ACRAQueryResultQueries AS TABLE
	(
		DATE		date			NOT NULL,
		BANK_NAME	nvarchar(100)	NOT NULL
	)
GO
