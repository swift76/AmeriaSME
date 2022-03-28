if exists (select * from sys.objects where name='sp_GetLoanParameters' and type='P')
	drop procedure dbo.sp_GetLoanParameters
GO

create procedure dbo.sp_GetLoanParameters(@LOAN_TYPE_CODE	char(2))
AS
	select	REPAYMENT_DAY_FROM,
			REPAYMENT_DAY_TO,
			IS_REPAY_DAY_FIXED,
			IS_REPAY_START_DAY,
			IS_REPAY_NEXT_MONTH,
			REPAY_TRANSITION_DAY,
			IS_OVERDRAFT,
			IS_CARD_ACCOUNT,
			IS_CREDIT_LINE,
			IS_SECURED,
			IS_ONLINE
	from dbo.LOAN_TYPE
	where CODE = @LOAN_TYPE_CODE
GO
