﻿if exists (select * from sys.objects where name='TAX_QUERY_RESULT' and type='U')
	drop table TAX_QUERY_RESULT
GO

CREATE TABLE TAX_QUERY_RESULT(
	APPLICATION_ID			uniqueidentifier	NOT NULL,
	COMPANY_TYPE			nvarchar(100)		NOT NULL,
	COMPANY_STATUS			nvarchar(100)		NOT NULL,
	TAX_TYPE				nvarchar(100)		NOT NULL,

	REGISTRATION_DISTRICT	nvarchar(20)		NOT NULL,
	REGISTRATION_COMMUNITY	nvarchar(40)		NOT NULL,
	REGISTRATION_STREET		nvarchar(100)		NOT NULL,
	REGISTRATION_BUILDING	nvarchar(40)		NOT NULL,
	REGISTRATION_APARTMENT	nvarchar(40)		NOT NULL,

	CURRENT_DISTRICT		nvarchar(20)		NULL,
	CURRENT_COMMUNITY		nvarchar(40)		NULL,
	CURRENT_STREET			nvarchar(100)		NULL,
	CURRENT_BUILDING		nvarchar(40)		NULL,
	CURRENT_APARTMENT		nvarchar(40)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iTAX_QUERY_RESULT1 ON TAX_QUERY_RESULT (APPLICATION_ID)
GO