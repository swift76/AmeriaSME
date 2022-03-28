if (not exists (select * from sys.types where name='TaxQueryResultReportCorrection'))
	CREATE TYPE TaxQueryResultReportCorrection AS TABLE
	(
		REPORT_NAME	nvarchar(1000)	NOT NULL,
		UPDATE_DATE	date			NULL,
		FIELD_NAME	nvarchar(1000)	NOT NULL,
		FIELD_VALUE	money			NOT NULL
	)
GO
