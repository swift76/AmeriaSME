if exists (select * from sys.objects where name='EREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE' and type='U')
	drop table EREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE
GO

CREATE TABLE EREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE(
	ID						uniqueidentifier	NOT NULL,
	COUNTRY					char(2)				NULL,
	DISTRICT				nvarchar(50)		NULL,
	COMMUNITY				nvarchar(50)		NULL,
	STREET					nvarchar(100)		NULL,
	BUILDING				nvarchar(50)		NULL,
	APARTMENT				nvarchar(50)		NULL,
	ADDRESS					nvarchar(200)		NULL,
	POSTAL_CODE				varchar(20)			NULL,
	POSITION				nvarchar(40)		NULL,
	PASSPORT_NUMBER			varchar(20)			NULL,
	PASSPORT_DATE			date				NULL,
	PASSPORT_EXPIRY_DATE	date				NULL,
	PASSPORT_BY				varchar(10)			NULL,
	SOCIAL_CARD_NUMBER		char(10)			NULL,
	BIRTH_DATE				date				NULL,
	GENDER					bit					NULL,
	CITIZENSHIP_CODE		char(2)				NULL,
	FIRST_NAME				nvarchar(60)		NULL,
	LAST_NAME				nvarchar(60)		NULL,
	PATRONYMIC_NAME			nvarchar(60)		NULL,
	FULL_NAME				nvarchar(100)		NULL
)
GO

CREATE CLUSTERED INDEX iEREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE1 ON EREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE (ID)
GO