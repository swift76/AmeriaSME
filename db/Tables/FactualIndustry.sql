if exists (select * from sys.objects where name='FACTUAL_INDUSTRY' and type='U')
	drop table FACTUAL_INDUSTRY
GO

CREATE TABLE FACTUAL_INDUSTRY (
	CODE 	char(2)			NOT NULL,
	NAME_AM	nvarchar(50)	NOT NULL,
	NAME_EN varchar(50)		NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iFACTUAL_INDUSTRY1 ON FACTUAL_INDUSTRY(CODE)
GO