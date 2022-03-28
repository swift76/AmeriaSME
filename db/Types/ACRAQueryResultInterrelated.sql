if (not exists (select * from sys.types where name='ACRAQueryResultInterrelated'))
	CREATE TYPE ACRAQueryResultInterrelated AS TABLE
	(
		STATUS				nvarchar(200)	NOT NULL,
		FROM_DATE			date			NOT NULL,
		TO_DATE				date			NOT NULL,
		CUR					char(3)			NOT NULL,
		RISK				nvarchar(200)	NOT NULL,
		CONTRACT_AMOUNT		money			NOT NULL,
		DUE_AMOUNT			money			NOT NULL,
		OVERDUE_AMOUNT		money			NOT NULL,
		OUTSTANDING_PERCENT	money			NOT NULL
	)
GO
