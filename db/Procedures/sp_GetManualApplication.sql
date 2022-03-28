if exists (select * from sys.objects where name='sp_GetManualApplication' and type='P')
	drop procedure dbo.sp_GetManualApplication
GO

create procedure dbo.sp_GetManualApplication(@ID	uniqueidentifier)
AS
	select  rtrim(LOAN_TERM) as LOAN_TERM,
			INTEREST,
			LOAN_REPAYMENT_FORM_CODE,
			LOAN_PURPOSE_CODE,
			GRACE_PERIOD,
			REPAYMENT_DAY,
			INVENTORY_BALANCE,
			DEBTORS_BALANCE,
			CREDITORS_BALANCE,
			MONTHLY_EARNING,
			MONTHLY_COST,
			MONTHLY_NET_INCOME,
			PLEDGE_TYPE_CODE,
			APPRAISAL_COMPANY_CODE,
			BANK_BRANCH_CODE,
			STATUS_ID,
			LOAN_TYPE_ID
	from dbo.APPLICATION
	where ID = @ID
GO
