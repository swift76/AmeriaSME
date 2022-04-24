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
	@DUE_DATES				ACRAQueryResultLoanDueDates	readonly,

    @LEGAL_RESPONSE_XML		nvarchar(max) = NULL,
	@COMPANY_TYPE			nvarchar(100) = NULL,
	@COMPANY_STATUS			nvarchar(100) = NULL,
	@TAX_TYPE				nvarchar(100) = NULL,

	@REGISTRATION_DISTRICT	nvarchar(20) = NULL,
	@REGISTRATION_COMMUNITY	nvarchar(40) = NULL,
	@REGISTRATION_STREET	nvarchar(100) = NULL,
	@REGISTRATION_BUILDING	nvarchar(40) = NULL,
	@REGISTRATION_APARTMENT	nvarchar(40) = NULL,

	@CURRENT_DISTRICT		nvarchar(20) = NULL,
	@CURRENT_COMMUNITY		nvarchar(40) = NULL,
	@CURRENT_STREET			nvarchar(100) = NULL,
	@CURRENT_BUILDING		nvarchar(40) = NULL,
	@CURRENT_APARTMENT		nvarchar(40) = NULL,

	@TAX_ACTIVITIES			TaxQueryResultData				readonly,
	@TAX_DEBTS				TaxQueryResultData				readonly,
	@TAX_PAYMENTS			TaxQueryResultData				readonly,
	@TAX_PURCHASES			TaxQueryResultData				readonly,
	@TAX_SALES				TaxQueryResultData				readonly,
	@TAX_SALARY_FUNDS		TaxQueryResultData				readonly,
	@TAX_PROFITS			TaxQueryResultData				readonly,
	@TAX_EMPLOYEES			TaxQueryResultEmployee			readonly,
	@TAX_REPORT_CORRECTIONS	TaxQueryResultReportCorrection	readonly
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
				OVERDUE_DAYS,INCOMING_DATE,DELAYED_PAYMENT_COUNT,PROVISION_AMOUNT)
		select @APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,TYPE,CUR,CONTRACT_AMOUNT,DEBT,PAST_DUE_DATE,RISK,CLASSIFICATION_DATE,
				INTEREST_RATE,PLEDGE,PLEDGE_AMOUNT,OUTSTANDING_AMOUNT,OUTSTANDING_PERCENT,BANK_NAME,IS_GUARANTEE,
				DUE_DAYS_1,DUE_DAYS_2,DUE_DAYS_3,DUE_DAYS_4,IS_CREDIT_LINE,IS_IGNORED_LOAN,
				DUE_DAYS_M1,DUE_DAYS_M2,DUE_DAYS_M3,SCOPE,DUE_DAYS_MAX_Y1,DUE_DAYS_MAX_Y2,LOAN_ID,
				CREDITING_DATE,CREDIT_USE_PLACE,PLEDGE_NOTES,PLEDGE_CURRENCY,
				LAST_PAYMENT_DATE,OVERDUE_MAIN_AMOUNT,OVERDUE_INTEREST_AMOUNT,PROLONGATION_COUNT,
				WORST_CLASS_Y1,WORST_CLASS_Y2,WORST_CLASS_Y3_Y5,
				SUM_OVERDUE_DAYS_Y1_Y2,MAX_OVERDUE_DAYS_Y1_Y2,SUM_OVERDUE_DAYS_Y1_Y5,MAX_OVERDUE_DAYS_Y1_Y5,
				OVERDUE_DAYS,INCOMING_DATE,DELAYED_PAYMENT_COUNT,PROVISION_AMOUNT
			from @DETAILS

		delete from ACRA_QUERY_RESULT_QUERIES where APPLICATION_ID=@APPLICATION_ID
		insert into ACRA_QUERY_RESULT_QUERIES
			(APPLICATION_ID,DATE,BANK_NAME,REASON)
		select @APPLICATION_ID,DATE,BANK_NAME,REASON
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

		if not @LEGAL_RESPONSE_XML is null and not exists (select APPLICATION_ID from ACRA_LEGAL_QUERY_RESULT where APPLICATION_ID=@APPLICATION_ID)
		begin
			insert into ACRA_LEGAL_QUERY_RESULT
				(APPLICATION_ID,RESPONSE_XML,PRESENCE_TYPE,CLASSIFICATION_COUNT,REVIEW_DATE,LOAN_WORST_CLASS,GUARANTEE_WORST_CLASS)
			values
				(@APPLICATION_ID,@LEGAL_RESPONSE_XML,@PRESENCE_TYPE,@CLASSIFICATION_COUNT,@REVIEW_DATE,@LOAN_WORST_CLASS,@GUARANTEE_WORST_CLASS)

			delete from ACRA_LEGAL_QUERY_RESULT_DETAILS where APPLICATION_ID=@APPLICATION_ID
			insert into ACRA_LEGAL_QUERY_RESULT_DETAILS
				(APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,TYPE,CUR,CONTRACT_AMOUNT,DEBT,PAST_DUE_DATE,RISK,CLASSIFICATION_DATE,
					INTEREST_RATE,PLEDGE,PLEDGE_AMOUNT,OUTSTANDING_AMOUNT,OUTSTANDING_PERCENT,BANK_NAME,IS_GUARANTEE,
					DUE_DAYS_1,DUE_DAYS_2,DUE_DAYS_3,DUE_DAYS_4,IS_CREDIT_LINE,IS_IGNORED_LOAN,
					DUE_DAYS_M1,DUE_DAYS_M2,DUE_DAYS_M3,SCOPE,DUE_DAYS_MAX_Y1,DUE_DAYS_MAX_Y2,LOAN_ID,
					CREDITING_DATE,CREDIT_USE_PLACE,PLEDGE_NOTES,PLEDGE_CURRENCY,
					LAST_PAYMENT_DATE,OVERDUE_MAIN_AMOUNT,OVERDUE_INTEREST_AMOUNT,PROLONGATION_COUNT,
					WORST_CLASS_Y1,WORST_CLASS_Y2,WORST_CLASS_Y3_Y5,
					SUM_OVERDUE_DAYS_Y1_Y2,MAX_OVERDUE_DAYS_Y1_Y2,SUM_OVERDUE_DAYS_Y1_Y5,MAX_OVERDUE_DAYS_Y1_Y5,
					OVERDUE_DAYS,INCOMING_DATE,DELAYED_PAYMENT_COUNT,PROVISION_AMOUNT)
			select @APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,TYPE,CUR,CONTRACT_AMOUNT,DEBT,PAST_DUE_DATE,RISK,CLASSIFICATION_DATE,
					INTEREST_RATE,PLEDGE,PLEDGE_AMOUNT,OUTSTANDING_AMOUNT,OUTSTANDING_PERCENT,BANK_NAME,IS_GUARANTEE,
					DUE_DAYS_1,DUE_DAYS_2,DUE_DAYS_3,DUE_DAYS_4,IS_CREDIT_LINE,IS_IGNORED_LOAN,
					DUE_DAYS_M1,DUE_DAYS_M2,DUE_DAYS_M3,SCOPE,DUE_DAYS_MAX_Y1,DUE_DAYS_MAX_Y2,LOAN_ID,
					CREDITING_DATE,CREDIT_USE_PLACE,PLEDGE_NOTES,PLEDGE_CURRENCY,
					LAST_PAYMENT_DATE,OVERDUE_MAIN_AMOUNT,OVERDUE_INTEREST_AMOUNT,PROLONGATION_COUNT,
					WORST_CLASS_Y1,WORST_CLASS_Y2,WORST_CLASS_Y3_Y5,
					SUM_OVERDUE_DAYS_Y1_Y2,MAX_OVERDUE_DAYS_Y1_Y2,SUM_OVERDUE_DAYS_Y1_Y5,MAX_OVERDUE_DAYS_Y1_Y5,
					OVERDUE_DAYS,INCOMING_DATE,DELAYED_PAYMENT_COUNT,PROVISION_AMOUNT
				from @DETAILS

			delete from ACRA_LEGAL_QUERY_RESULT_QUERIES where APPLICATION_ID=@APPLICATION_ID
			insert into ACRA_LEGAL_QUERY_RESULT_QUERIES
				(APPLICATION_ID,DATE,BANK_NAME,REASON)
			select @APPLICATION_ID,DATE,BANK_NAME,REASON
				from @QUERIES

			delete from ACRA_LEGAL_QUERY_RESULT_INTERRELATED where APPLICATION_ID=@APPLICATION_ID
			insert into ACRA_LEGAL_QUERY_RESULT_INTERRELATED
				(APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,CUR,RISK,CONTRACT_AMOUNT,DUE_AMOUNT,OVERDUE_AMOUNT,OUTSTANDING_PERCENT)
			select @APPLICATION_ID,STATUS,FROM_DATE,TO_DATE,CUR,RISK,CONTRACT_AMOUNT,DUE_AMOUNT,OVERDUE_AMOUNT,OUTSTANDING_PERCENT
				from @INTERRELATED

			delete from ACRA_LEGAL_QUERY_RESULT_PAYMENTS where APPLICATION_ID=@APPLICATION_ID
			insert into ACRA_LEGAL_QUERY_RESULT_PAYMENTS
				(APPLICATION_ID,YEAR,MONTH,CUR,AMOUNT)
			select @APPLICATION_ID,YEAR,MONTH,CUR,AMOUNT
				from @PAYMENTS

			delete from ACRA_LEGAL_QUERY_RESULT_LOAN_DUE_DATES where APPLICATION_ID=@APPLICATION_ID
			insert into ACRA_LEGAL_QUERY_RESULT_LOAN_DUE_DATES
				(APPLICATION_ID,LOAN_ID,YEAR,MONTH,COUNT)
			select @APPLICATION_ID,LOAN_ID,YEAR,MONTH,COUNT
				from @DUE_DATES

			delete from TAX_QUERY_RESULT where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT
				(APPLICATION_ID,COMPANY_TYPE,COMPANY_STATUS,TAX_TYPE
				,REGISTRATION_DISTRICT,REGISTRATION_COMMUNITY,REGISTRATION_STREET,REGISTRATION_BUILDING,REGISTRATION_APARTMENT
				,CURRENT_DISTRICT,CURRENT_COMMUNITY,CURRENT_STREET,CURRENT_BUILDING,CURRENT_APARTMENT)
			values
				(@APPLICATION_ID,@COMPANY_TYPE,@COMPANY_STATUS,@TAX_TYPE
				,@REGISTRATION_DISTRICT,@REGISTRATION_COMMUNITY,@REGISTRATION_STREET,@REGISTRATION_BUILDING,@REGISTRATION_APARTMENT
				,@CURRENT_DISTRICT,@CURRENT_COMMUNITY,@CURRENT_STREET,@CURRENT_BUILDING,@CURRENT_APARTMENT)

			delete from TAX_QUERY_RESULT_ACTIVITY where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_ACTIVITY
				(APPLICATION_ID,ACTIVITY_TYPE,PROPORTION)
			select @APPLICATION_ID,TYPE,AMOUNT
				from @TAX_ACTIVITIES

			delete from TAX_QUERY_RESULT_DEBT where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_DEBT
				(APPLICATION_ID,DEBT_TYPE,PERIOD,UPDATE_DATE,DEBT,OUTSTANDING,FINE,OVERPAYMENT)
			select @APPLICATION_ID,TYPE,PERIOD,UPDATE_DATE,AMOUNT,OUTSTANDING,FINE,OVERPAYMENT
				from @TAX_DEBTS

			delete from TAX_QUERY_RESULT_PAYMENT where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_PAYMENT
				(APPLICATION_ID,PAYMENT_TYPE,PERIOD,UPDATE_DATE,AMOUNT)
			select @APPLICATION_ID,TYPE,PERIOD,UPDATE_DATE,AMOUNT
				from @TAX_PAYMENTS

			delete from TAX_QUERY_RESULT_PURCHASE where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_PURCHASE
				(APPLICATION_ID,PERIOD,UPDATE_DATE,AMOUNT)
			select @APPLICATION_ID,PERIOD,UPDATE_DATE,AMOUNT
				from @TAX_PURCHASES

			delete from TAX_QUERY_RESULT_SALE where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_SALE
				(APPLICATION_ID,SALE_TYPE,PERIOD,UPDATE_DATE,AMOUNT)
			select @APPLICATION_ID,TYPE,PERIOD,UPDATE_DATE,AMOUNT
				from @TAX_SALES

			delete from TAX_QUERY_RESULT_SALARY_FUND where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_SALARY_FUND
				(APPLICATION_ID,PERIOD,UPDATE_DATE,AMOUNT)
			select @APPLICATION_ID,PERIOD,UPDATE_DATE,AMOUNT
				from @TAX_SALARY_FUNDS

			delete from TAX_QUERY_RESULT_PROFIT where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_PROFIT
				(APPLICATION_ID,PERIOD,UPDATE_DATE,AMOUNT)
			select @APPLICATION_ID,PERIOD,UPDATE_DATE,AMOUNT
				from @TAX_PROFITS

			delete from TAX_QUERY_RESULT_EMPLOYEE where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_EMPLOYEE
				(APPLICATION_ID,PERIOD,UPDATE_DATE,NUMBER)
			select @APPLICATION_ID,PERIOD,UPDATE_DATE,NUMBER
				from @TAX_EMPLOYEES

			delete from TAX_QUERY_RESULT_REPORT_CORRECTION where APPLICATION_ID=@APPLICATION_ID
			insert into TAX_QUERY_RESULT_REPORT_CORRECTION
				(APPLICATION_ID,REPORT_NAME,UPDATE_DATE,FIELD_NAME,FIELD_VALUE)
			select @APPLICATION_ID,REPORT_NAME,UPDATE_DATE,FIELD_NAME,FIELD_VALUE
				from @TAX_REPORT_CORRECTIONS
		end

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
