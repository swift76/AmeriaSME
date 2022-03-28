if (not exists (select * from sys.types where name='ApplicationRelatedPerson'))
	CREATE TYPE ApplicationRelatedPerson AS TABLE
	(
		NAME			nvarchar(100)	NOT NULL,
		DOCUMENT_NUMBER	varchar(10)		NOT NULL
	)
GO
