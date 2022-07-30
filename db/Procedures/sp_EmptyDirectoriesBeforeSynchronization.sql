create or alter procedure sp_EmptyDirectoriesBeforeSynchronization
AS
	BEGIN TRANSACTION

	BEGIN TRY
		truncate table COUNTRY
		truncate table STATE
		truncate table CITY
		truncate table APPLICATION_SCAN_TYPE
		truncate table BANK_BRANCH
		truncate table APPRAISAL_COMPANY
		truncate table ACTIVITY
		truncate table FACTUAL_INDUSTRY
		truncate table PLEDGE_TYPE
		truncate table ACRA_CREDIT_LINE_TYPE
		truncate table ACRA_IGNORED_LOAN_TYPE
		truncate table EREGISTER_INDUSTRY

		truncate table INDUSTRY_TYPE
		truncate table COMPANY_OPERATIONAL_EXPENSE_TYPE
		truncate table COMPANY_NONOPERATIONAL_EXPENSE_TYPE
		truncate table COMPANY_BALANCE_TYPE
		truncate table COMPANY_OTHER_STATISTICS_TYPE
		truncate table BUSINESS_STATE_TYPE
		truncate table LOAN_SPECIALIST_LOAN_TERM
		truncate table INSURANCE_COMPANY
		truncate table LOAN_USAGE

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
