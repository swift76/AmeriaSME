if exists (select * from sys.objects where name='AM0_SME_CONTRACT_PRINT' and type='U')
	drop table dbo.AM0_SME_CONTRACT_PRINT
GO

CREATE TABLE AM0_SME_CONTRACT_PRINT (
	APPLICATION_ID	uniqueidentifier	NOT NULL,
	CONTENT			varbinary(max)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAM0_SME_CONTRACT_PRINT1 ON dbo.AM0_SME_CONTRACT_PRINT(APPLICATION_ID)
GO
