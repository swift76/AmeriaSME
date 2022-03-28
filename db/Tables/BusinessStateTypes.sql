if exists (select * from sys.objects where name='BUSINESS_STATE_TYPE' and type='U')
	drop table dbo.BUSINESS_STATE_TYPE
GO

CREATE TABLE dbo.BUSINESS_STATE_TYPE (
	CODE 	char(3)			NOT NULL,
	NAME_AM	nvarchar(100)	NOT NULL,
	NAME_EN varchar(100)	NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iBUSINESS_STATE_TYPE1 ON dbo.BUSINESS_STATE_TYPE(CODE)
GO
