if exists (select * from sys.objects where name='EREGISTER_QUERY_RESULT' and type='U')
	drop table EREGISTER_QUERY_RESULT
GO

CREATE TABLE EREGISTER_QUERY_RESULT(
	QUERY_DATE			datetime			NOT NULL default getdate(),
	APPLICATION_ID		uniqueidentifier	NOT NULL,
	COUNTRY				char(2)				NULL,
	DISTRICT			nvarchar(20)		NULL,
	COMMUNITY			nvarchar(40)		NULL,
	STREET				nvarchar(100)		NULL,
	BUILDING			nvarchar(40)		NULL,
	APARTMENT			nvarchar(40)		NULL,
	ADDRESS				nvarchar(100)		NULL,
	POSTAL_CODE			varchar(20)			NULL,
	CERTIFICATE_CODE	nvarchar(20)		NULL,
	REGISTRATION_CODE	nvarchar(20)		NULL,
	REGISTRATION_DATE	date				NULL,
	TYPE				nvarchar(40)		NULL,
	IS_ACTIVE			bit					NULL,
	INDUSTRY_CODE		varchar(20)			NULL,
	NAME_AM				nvarchar(100)		NULL,
	NAME_EN				varchar(100)		NULL,
	NAME_RU				nvarchar(100)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iEREGISTER_QUERY_RESULT1 ON EREGISTER_QUERY_RESULT (APPLICATION_ID)
GO
