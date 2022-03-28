if (not exists (select * from sys.types where name='NORQLegalQueryResultFounder'))
	CREATE TYPE NORQLegalQueryResultFounder AS TABLE
	(
		NAME			nvarchar(100)	NOT NULL,
		DOCUMENT_NUMBER	nvarchar(20)	NOT NULL
	)
GO
