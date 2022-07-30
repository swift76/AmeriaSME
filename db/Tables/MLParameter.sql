if exists (select * from sys.objects where name='ML_PARAMETER' and type='U')
	drop table ML_PARAMETER
GO

CREATE TABLE ML_PARAMETER(
	QUERY_DATE						datetime			NOT NULL default getdate(),
	APPLICATION_ID					uniqueidentifier	NOT NULL,
	AMOUNT_NON_REFINANCING			money				NOT NULL,
	AMOUNT_REFINANCING				money				NOT NULL,
	LOAN_USAGE_CODE					nvarchar(2)			NOT NULL,
	AGE								tinyint				NOT NULL,
	UNSECURED_REMAINDER_OTHER_BANKS	money				NOT NULL,
	MONTHLY_REPAYMENT				money				NOT NULL,
	IN_TURN 						money				NOT NULL,
	OUT_TURN						money				NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iML_PARAMETER1 ON ML_PARAMETER (APPLICATION_ID)
GO
