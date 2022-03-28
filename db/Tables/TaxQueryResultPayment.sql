﻿if exists (select * from sys.objects where name='TAX_QUERY_RESULT_PAYMENT' and type='U')
	drop table TAX_QUERY_RESULT_PAYMENT
GO

CREATE TABLE TAX_QUERY_RESULT_PAYMENT(
	APPLICATION_ID	uniqueidentifier	NOT NULL,
	PAYMENT_TYPE	nvarchar(200)		NOT NULL,
	PERIOD			varchar(20)			NOT NULL,
	UPDATE_DATE		date				NULL,
	AMOUNT			money				NOT NULL
)
GO

CREATE CLUSTERED INDEX iTAX_QUERY_RESULT_PAYMENT1 ON TAX_QUERY_RESULT_PAYMENT (APPLICATION_ID)
GO
