if exists (select * from sys.objects where name='CANCELLATION_REASON' and type='U')
	drop table dbo.CANCELLATION_REASON
GO

CREATE TABLE dbo.CANCELLATION_REASON (
	CODE 	char(2)			NOT NULL,
	NAME_AM	nvarchar(50)	NOT NULL,
	NAME_EN varchar(50)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iCANCELLATION_REASON1 ON dbo.CANCELLATION_REASON(CODE)
GO
