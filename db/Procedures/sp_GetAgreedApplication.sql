if exists (select * from sys.objects where name='sp_GetAgreedApplication' and type='P')
	drop procedure dbo.sp_GetAgreedApplication
GO

create procedure dbo.sp_GetAgreedApplication(@ID	uniqueidentifier)
AS
	select	EXISTING_CARD_CODE,
			IS_NEW_CARD,
			IS_CARD_DELIVERY,
			CREDIT_CARD_TYPE_CODE,
			CARD_DELIVERY_ADDRESS,
			BANK_BRANCH_CODE,
			IS_INTERNET_BANK_CHECKED,
			IS_ARBITRAGE_CHECKED,
			GUARANTEE_SIGNATURE_TEXT,
			STATUS_ID,
			LOAN_TYPE_ID,
			CLIENT_CODE,
			LOAN_TEMPLATE_CODE,
			OVERDRAFT_TEMPLATE_CODE,
			REPAYMENT_DAY,
			CURRENCY_CODE,
			FINAL_AMOUNT,
			LOAN_TERM,
			INTEREST
	from dbo.APPLICATION
	where ID = @ID
GO
