﻿if exists (select * from sys.objects where name='NORQ_LEGAL_QUERY_RESULT_FOUNDER' and type='U')
	drop table NORQ_LEGAL_QUERY_RESULT_FOUNDER
GO

CREATE TABLE NORQ_LEGAL_QUERY_RESULT_FOUNDER(
	APPLICATION_ID	uniqueidentifier	NOT NULL,
	NAME			nvarchar(100)		NOT NULL,
	DOCUMENT_NUMBER	nvarchar(20)		NOT NULL
)
GO

CREATE CLUSTERED INDEX iNORQ_LEGAL_QUERY_RESULT_FOUNDER1 ON NORQ_LEGAL_QUERY_RESULT_FOUNDER (APPLICATION_ID)
GO
