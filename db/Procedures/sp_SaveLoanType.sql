if exists (select * from sys.objects where name='sp_SaveLoanType' and type='P')
	drop procedure sp_SaveLoanType
GO

create procedure sp_SaveLoanType(@CODE					char(2),
								 @NAME_AM				nvarchar(50),
								 @NAME_EN				varchar(50),
								 @DESCRIPTION_AM		nvarchar(max),
								 @DESCRIPTION_EN		varchar(max),
								 @FROM_DATE				date,
								 @TO_DATE				date,
								 @REPAYMENT_DAY_FROM	tinyint,
								 @REPAYMENT_DAY_TO		tinyint,
								 @IS_OVERDRAFT			bit,
								 @IS_REPAY_DAY_FIXED	bit,
								 @IS_CARD_ACCOUNT		bit,
								 @IS_REPAY_START_DAY	bit,
								 @IS_REPAY_NEXT_MONTH	bit,
								 @REPAY_TRANSITION_DAY	tinyint,
								 @IS_CREDIT_LINE		bit,
								 @IS_SECURED			bit,
								 @IS_ONLINE				bit,
								 @IS_AUTO_APPROVED		bit,
								 @IS_LOAN_SPECIALIST	bit,
								 @IS_CUSTOMER			bit)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		delete from LOAN_TYPE where CODE = @CODE

		insert into LOAN_TYPE (
			CODE,
			NAME_AM,
			NAME_EN,
			DESCRIPTION_AM,
			DESCRIPTION_EN,
			FROM_DATE,
			TO_DATE,
			REPAYMENT_DAY_FROM,
			REPAYMENT_DAY_TO,
			IS_OVERDRAFT,
			IS_REPAY_DAY_FIXED,
			IS_CARD_ACCOUNT,
			IS_REPAY_START_DAY,
			IS_REPAY_NEXT_MONTH,
			REPAY_TRANSITION_DAY,
			IS_CREDIT_LINE,
			IS_SECURED,
			IS_ONLINE,
			IS_AUTO_APPROVED,
			IS_LOAN_SPECIALIST,
			IS_CUSTOMER
		)
		values (
			@CODE,
			dbo.ahf_ANSI2Unicode(@NAME_AM),
			@NAME_EN,
			dbo.ahf_ANSI2Unicode(@DESCRIPTION_AM),
			@DESCRIPTION_EN,
			@FROM_DATE,
			@TO_DATE,
			@REPAYMENT_DAY_FROM,
			@REPAYMENT_DAY_TO,
			@IS_OVERDRAFT,
			@IS_REPAY_DAY_FIXED,
			@IS_CARD_ACCOUNT,
			@IS_REPAY_START_DAY,
			@IS_REPAY_NEXT_MONTH,
			@REPAY_TRANSITION_DAY,
			@IS_CREDIT_LINE,
			@IS_SECURED,
			@IS_ONLINE,
			@IS_AUTO_APPROVED,
			@IS_LOAN_SPECIALIST,
			@IS_CUSTOMER
		)
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
