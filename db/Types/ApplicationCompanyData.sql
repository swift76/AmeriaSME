if (not exists (select * from sys.types where name='ApplicationCompanyData'))
	CREATE TYPE ApplicationCompanyData AS TABLE
	(
		CODE	char(4)			NOT NULL,
		AMOUNT	money			NOT NULL,
		COMMENT	nvarchar(100)	NULL
	)
GO
