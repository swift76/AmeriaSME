if exists (select * from sys.objects where name='NORQ_QUERY_RESULT' and type='U')
	drop table NORQ_QUERY_RESULT
GO

CREATE TABLE NORQ_QUERY_RESULT(
	QUERY_DATE						datetime			NOT NULL default getdate(),
	APPLICATION_ID					uniqueidentifier	NOT NULL,
	FIRST_NAME						nvarchar(20)		NULL,
	LAST_NAME						nvarchar(20)		NULL,
	PATRONYMIC_NAME					nvarchar(20)		NULL,
	BIRTH_DATE						date				NULL,
	GENDER							bit					NULL,
	DISTRICT						nvarchar(20)		NULL,
	COMMUNITY						nvarchar(40)		NULL,
	STREET							nvarchar(100)		NULL,
	BUILDING						nvarchar(40)		NULL,
	APARTMENT						nvarchar(40)		NULL,
	ADDRESS							nvarchar(100)		NULL,
	FEE								money				NULL,
	PASSPORT_NUMBER					char(9)				NULL,
	PASSPORT_DATE					date				NULL,
	PASSPORT_EXPIRY_DATE			date				NULL,
	PASSPORT_BY						char(3)				NULL,
	BIOMETRIC_PASSPORT_NUMBER		char(9)				NULL,
	BIOMETRIC_PASSPORT_ISSUE_DATE	date				NULL,
	BIOMETRIC_PASSPORT_EXPIRY_DATE	date				NULL,
	BIOMETRIC_PASSPORT_ISSUED_BY	char(3)				NULL,
	ID_CARD_NUMBER					char(9)				NULL,
	ID_CARD_ISSUE_DATE				date				NULL,
	ID_CARD_EXPIRY_DATE				date				NULL,
	ID_CARD_ISSUED_BY				char(3)				NULL,
	SOCIAL_CARD_NUMBER				char(10)			NULL,
	RESPONSE_XML					nvarchar(max)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iNORQ_QUERY_RESULT1 ON NORQ_QUERY_RESULT (APPLICATION_ID)
GO
