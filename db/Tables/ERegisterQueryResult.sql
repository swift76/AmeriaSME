﻿if exists (select * from sys.objects where name='EREGISTER_QUERY_RESULT' and type='U')
	drop table EREGISTER_QUERY_RESULT
GO

CREATE TABLE EREGISTER_QUERY_RESULT(
	QUERY_DATE			datetime			NOT NULL default getdate(),
	APPLICATION_ID		uniqueidentifier	NOT NULL,
	COUNTRY				char(2)				NOT NULL,
	DISTRICT			nvarchar(20)		NOT NULL,
	COMMUNITY			nvarchar(40)		NOT NULL,
	STREET				nvarchar(100)		NOT NULL,
	BUILDING			nvarchar(40)		NOT NULL,
	APARTMENT			nvarchar(40)		NOT NULL,
	ADDRESS				nvarchar(100)		NOT NULL,
	POSTAL_CODE			varchar(20)			NOT NULL,
	CERTIFICATE_CODE	nvarchar(20)		NOT NULL,
	REGISTRATION_CODE	nvarchar(20)		NOT NULL,
	REGISTRATION_DATE	date				NOT NULL,
	TYPE				nvarchar(40)		NOT NULL,
	IS_ACTIVE			bit					NOT NULL,
	INDUSTRY_CODE		varchar(20)			NOT NULL,
	NAME_AM				nvarchar(100)		NOT NULL,
	NAME_EN				varchar(100)		NOT NULL,
	NAME_RU				nvarchar(100)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iEREGISTER_QUERY_RESULT1 ON EREGISTER_QUERY_RESULT (APPLICATION_ID)
GO
