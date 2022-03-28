if exists (select * from sys.objects where name='EREGISTER_QUERY_RESULT_OWNER' and type='U')
	drop table EREGISTER_QUERY_RESULT_OWNER
GO

CREATE TABLE EREGISTER_QUERY_RESULT_OWNER(
	QUERY_DATE				datetime			NOT NULL default getdate(),
	APPLICATION_ID			uniqueidentifier	NOT NULL,
	COUNTRY					char(2)				NULL,
	DISTRICT				nvarchar(20)		NULL,
	COMMUNITY				nvarchar(40)		NULL,
	STREET					nvarchar(100)		NULL,
	BUILDING				nvarchar(40)		NULL,
	APARTMENT				nvarchar(40)		NULL,
	ADDRESS					nvarchar(100)		NULL,
	POSTAL_CODE				varchar(20)			NULL,
	PASSPORT_NUMBER			varchar(20)			NULL,
	PASSPORT_DATE			date				NULL,
	PASSPORT_EXPIRY_DATE	date				NULL,
	PASSPORT_BY				varchar(10)			NULL,
	SOCIAL_CARD_NUMBER		char(10)			NULL,
	BIRTH_DATE				date				NULL,
	GENDER					bit					NULL,
	CITIZENSHIP_CODE		char(2)				NULL,
	FIRST_NAME				nvarchar(20)		NULL,
	LAST_NAME				nvarchar(20)		NULL,
	PATRONYMIC_NAME			nvarchar(20)		NULL,
	FULL_NAME				nvarchar(60)		NULL,
	IS_FOUNDER				bit					NULL,
	IS_LEGAL				bit					NULL,
	JOIN_DATE				date				NULL,
	LEAVE_DATE				date				NULL
)
GO

CREATE CLUSTERED INDEX iEREGISTER_QUERY_RESULT_OWNER1 ON EREGISTER_QUERY_RESULT_OWNER (APPLICATION_ID)
GO
