﻿if exists (select * from sys.objects where name='ACRA_IGNORED_LOAN_TYPE' and type='U')
	drop table ACRA_IGNORED_LOAN_TYPE
GO

CREATE TABLE ACRA_IGNORED_LOAN_TYPE(
	ID		int				NOT NULL identity(1,1),
	TYPE	nvarchar(200)	NOT NULL
)
GO

CREATE CLUSTERED INDEX iACRA_IGNORED_LOAN_TYPE1 ON ACRA_IGNORED_LOAN_TYPE(ID)
GO
