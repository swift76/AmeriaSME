﻿truncate table dbo.LOAN_SETTING
GO

insert into dbo.LOAN_SETTING (REPEAT_COUNT, REPEAT_DAY_COUNT, EXPIRE_DAY_COUNT, CONTACT_DAY_COUNT, LS_EXPIRE_DAY_COUNT)
	values (30, 90, 7, 3, 8)
GO