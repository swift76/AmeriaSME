﻿create or alter procedure sp_SaveACRAQueryResult(
	@APPLICATION_ID			uniqueidentifier,
    @FICO_SCORE				char(3),
    @RESPONSE_XML			nvarchar(max),
	@PRESENCE_TYPE			varchar(2),
	@CLASSIFICATION_COUNT	int,
	@REVIEW_DATE			date,
	@LOAN_WORST_CLASS		nvarchar(200),
	@GUARANTEE_WORST_CLASS	nvarchar(200),
    @DETAILS				ACRAQueryResultDetails		readonly,
    @QUERIES				ACRAQueryResultQueries		readonly,
	@INTERRELATED			ACRAQueryResultInterrelated	readonly,
	@PAYMENTS				ACRAQueryResultPayments		readonly,
	@DUE_DATES				ACRAQueryResultLoanDueDates	readonly
)
AS
	BEGIN TRANSACTION
	BEGIN TRY
		declare @STATUS_ID tinyint

		select @STATUS_ID = STATUS_ID from APPLICATION with (updlock) where ID = @APPLICATION_ID

		if @STATUS_ID <> 5
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		insert into ACRA_QUERY_RESULT
			(APPLICATION_ID,FICO_SCORE,RESPONSE_XML,PRESENCE_TYPE,CLASSIFICATION_COUNT,REVIEW_DATE,LOAN_WORST_CLASS,GUARANTEE_WORST_CLASS)
		values
			(@APPLICATION_ID,@FICO_SCORE,@RESPONSE_XML,@PRESENCE_TYPE,@CLASSIFICATION_COUNT,@REVIEW_DATE,@LOAN_WORST_CLASS,@GUARANTEE_WORST_CLASS)

		delete from ACRA_QUERY_RESULT_DETAILS where APPLICATION_ID=@APPLICATION_ID
		insert into ACRA_QUERY_RESULT_DETAILS
			(APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,TYPE,CUR,CONTRACT_AMOUNT,DEBT,PAST_DUE_DATE,RISK,CLASSIFICATION_DATE,
				INTEREST_RATE,PLEDGE,PLEDGE_AMOUNT,OUTSTANDING_AMOUNT,OUTSTANDING_PERCENT,BANK_NAME,IS_GUARANTEE,
				DUE_DAYS_1,DUE_DAYS_2,DUE_DAYS_3,DUE_DAYS_4,IS_CREDIT_LINE,IS_IGNORED_LOAN,
				DUE_DAYS_M1,DUE_DAYS_M2,DUE_DAYS_M3,SCOPE,DUE_DAYS_MAX_Y1,DUE_DAYS_MAX_Y2,LOAN_ID,
				CREDITING_DATE,CREDIT_USE_PLACE,PLEDGE_NOTES,PLEDGE_CURRENCY,
				LAST_PAYMENT_DATE,OVERDUE_MAIN_AMOUNT,OVERDUE_INTEREST_AMOUNT,PROLONGATION_COUNT,
				WORST_CLASS_Y1,WORST_CLASS_Y2,WORST_CLASS_Y3_Y5,
				SUM_OVERDUE_DAYS_Y1_Y2,MAX_OVERDUE_DAYS_Y1_Y2,SUM_OVERDUE_DAYS_Y1_Y5,MAX_OVERDUE_DAYS_Y1_Y5,
				OVERDUE_DAYS,INCOMING_DATE,DELAYED_PAYMENT_COUNT)
		select @APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,TYPE,CUR,CONTRACT_AMOUNT,DEBT,PAST_DUE_DATE,RISK,CLASSIFICATION_DATE,
				INTEREST_RATE,PLEDGE,PLEDGE_AMOUNT,OUTSTANDING_AMOUNT,OUTSTANDING_PERCENT,BANK_NAME,IS_GUARANTEE,
				DUE_DAYS_1,DUE_DAYS_2,DUE_DAYS_3,DUE_DAYS_4,IS_CREDIT_LINE,IS_IGNORED_LOAN,
				DUE_DAYS_M1,DUE_DAYS_M2,DUE_DAYS_M3,SCOPE,DUE_DAYS_MAX_Y1,DUE_DAYS_MAX_Y2,LOAN_ID,
				CREDITING_DATE,CREDIT_USE_PLACE,PLEDGE_NOTES,PLEDGE_CURRENCY,
				LAST_PAYMENT_DATE,OVERDUE_MAIN_AMOUNT,OVERDUE_INTEREST_AMOUNT,PROLONGATION_COUNT,
				WORST_CLASS_Y1,WORST_CLASS_Y2,WORST_CLASS_Y3_Y5,
				SUM_OVERDUE_DAYS_Y1_Y2,MAX_OVERDUE_DAYS_Y1_Y2,SUM_OVERDUE_DAYS_Y1_Y5,MAX_OVERDUE_DAYS_Y1_Y5,
				OVERDUE_DAYS,INCOMING_DATE,DELAYED_PAYMENT_COUNT
			from @DETAILS

		delete from ACRA_QUERY_RESULT_QUERIES where APPLICATION_ID=@APPLICATION_ID
		insert into ACRA_QUERY_RESULT_QUERIES
			(APPLICATION_ID,DATE,BANK_NAME)
		select @APPLICATION_ID,DATE,BANK_NAME
			from @QUERIES

		delete from ACRA_QUERY_RESULT_INTERRELATED where APPLICATION_ID=@APPLICATION_ID
		insert into ACRA_QUERY_RESULT_INTERRELATED
			(APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,CUR,RISK,CONTRACT_AMOUNT,DUE_AMOUNT,OVERDUE_AMOUNT,OUTSTANDING_PERCENT)
		select @APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,CUR,RISK,CONTRACT_AMOUNT,DUE_AMOUNT,OVERDUE_AMOUNT,OUTSTANDING_PERCENT
			from @INTERRELATED

		delete from ACRA_QUERY_RESULT_PAYMENTS where APPLICATION_ID=@APPLICATION_ID
		insert into ACRA_QUERY_RESULT_PAYMENTS
			(APPLICATION_ID,YEAR,MONTH,CUR,AMOUNT)
		select @APPLICATION_ID,YEAR,MONTH,CUR,AMOUNT
			from @PAYMENTS

		delete from ACRA_QUERY_RESULT_LOAN_DUE_DATES where APPLICATION_ID=@APPLICATION_ID
		insert into ACRA_QUERY_RESULT_LOAN_DUE_DATES
			(APPLICATION_ID,LOAN_ID,YEAR,MONTH,COUNT)
		select @APPLICATION_ID,LOAN_ID,YEAR,MONTH,COUNT
			from @DUE_DATES

		execute sp_ChangeApplicationStatus @APPLICATION_ID,6
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage varchar(4000)
		set @ErrorMessage = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
	COMMIT TRANSACTION
GO
