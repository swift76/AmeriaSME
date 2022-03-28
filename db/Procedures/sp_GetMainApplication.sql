if exists (select * from sys.objects where name='sp_GetMainApplication' and type='P')
	drop procedure dbo.sp_GetMainApplication
GO

create procedure dbo.sp_GetMainApplication(@ID	uniqueidentifier)
AS
	select  FINAL_AMOUNT,
			INTEREST,
			REPAYMENT_DAY,
			CURRENCY_CODE,
			rtrim(LOAN_TERM) as LOAN_TERM,
			LOAN_TEMPLATE_CODE,
			OVERDRAFT_TEMPLATE_CODE,
			STATUS_ID,
			LOAN_TYPE_ID
	from dbo.APPLICATION
	where ID = @ID
GO
