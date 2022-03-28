if exists (select * from sys.objects where name='APPLICATION_KYC_OTHER_BANK_INFO' and type='U')
	drop table dbo.APPLICATION_KYC_OTHER_BANK_INFO
GO

CREATE TABLE dbo.APPLICATION_KYC_OTHER_BANK_INFO(
	ID				int 				IDENTITY(1,1) NOT NULL,
	APPLICATION_ID	uniqueidentifier	NOT NULL,
	NAME			nvarchar(250)		NULL,
	ACCOUNT_TYPE	nvarchar(250)		NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION_KYC_OTHER_BANK_INFO1 ON APPLICATION_KYC_OTHER_BANK_INFO (ID)
GO

CREATE INDEX iAPPLICATION_KYC_OTHER_BANK_INFO2 ON APPLICATION_KYC_OTHER_BANK_INFO (APPLICATION_ID)
GO
