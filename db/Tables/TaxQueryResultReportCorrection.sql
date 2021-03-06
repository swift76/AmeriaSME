if exists (select * from sys.objects where name='TAX_QUERY_RESULT_REPORT_CORRECTION' and type='U')
	drop table TAX_QUERY_RESULT_REPORT_CORRECTION
GO

CREATE TABLE TAX_QUERY_RESULT_REPORT_CORRECTION(
	APPLICATION_ID	uniqueidentifier	NOT NULL,
	REPORT_NAME		nvarchar(1000)		NOT NULL,
	UPDATE_DATE		date				NULL,
	FIELD_NAME		nvarchar(1000)		NOT NULL,
	FIELD_VALUE		money				NOT NULL
)
GO

CREATE CLUSTERED INDEX iTAX_QUERY_RESULT_REPORT_CORRECTION1 ON TAX_QUERY_RESULT_REPORT_CORRECTION (APPLICATION_ID)
GO
