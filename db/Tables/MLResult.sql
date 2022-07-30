if exists (select * from sys.objects where name='ML_RESULT' and type='U')
	drop table ML_RESULT
GO

CREATE TABLE ML_RESULT(
	APPLICATION_ID	uniqueidentifier	NOT NULL,
	IS_REFINANCING	bit					NOT NULL,
	PD				money				NOT NULL,
	AMOUNT			money				NOT NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iML_RESULT1 ON ML_RESULT (APPLICATION_ID,IS_REFINANCING)
GO
