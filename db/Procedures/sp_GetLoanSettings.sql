if exists (select * from sys.objects where name='sp_GetLoanSettings' and type='P')
	drop procedure dbo.sp_GetLoanSettings
GO

create procedure dbo.sp_GetLoanSettings
AS
	select
		REPEAT_COUNT,
		REPEAT_DAY_COUNT,
		EXPIRE_DAY_COUNT,
		CONTACT_DAY_COUNT,
		isnull(LS_EXPIRE_DAY_COUNT,0) as LS_EXPIRE_DAY_COUNT
	from dbo.LOAN_SETTING
GO
