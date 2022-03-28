if exists (select * from sys.objects where name='sp_SaveManualApplication' and type='P')
	drop procedure dbo.sp_SaveManualApplication
GO

create procedure dbo.sp_SaveManualApplication(@APPLICATION_ID 			uniqueidentifier,
											  @LOAN_TERM				char(3)		= null,
											  @INTEREST					money		= null,
											  @LOAN_REPAYMENT_FORM_CODE char(1)		= null,
											  @LOAN_PURPOSE_CODE		char(1)		= null,
											  @GRACE_PERIOD				tinyint		= null,
											  @REPAYMENT_DAY			tinyint		= null,
											  @INVENTORY_BALANCE		money		= null,
											  @DEBTORS_BALANCE			money		= null,
											  @CREDITORS_BALANCE		money		= null,
											  @MONTHLY_EARNING			money		= null,
											  @MONTHLY_COST				money		= null,
											  @MONTHLY_NET_INCOME		money		= null,
											  @PLEDGE_TYPE_CODE			char(1)		= null,
											  @APPRAISAL_COMPANY_CODE	char(3)		= null,
											  @BANK_BRANCH_CODE			char(3)		= null,
											  @OPERATION_DETAILS		nvarchar(max),
											  @IS_SUBMIT				bit)

AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @STATUS_ID tinyint, @USER_ID int, @LOAN_TYPE_ID char(2)

		select @STATUS_ID = STATUS_ID, @USER_ID = USER_ID, @LOAN_TYPE_ID = LOAN_TYPE_ID
		from dbo.APPLICATION with (updlock) where ID = @APPLICATION_ID

		if not @STATUS_ID in (10, 21)
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		insert into dbo.APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@USER_ID, @LOAN_TYPE_ID, 'EDIT MANUALLY', @APPLICATION_ID, @OPERATION_DETAILS)

		update dbo.APPLICATION set
			LOAN_TERM				= isnull(@LOAN_TERM,				LOAN_TERM),
			INTEREST				= isnull(@INTEREST,					INTEREST),
			LOAN_REPAYMENT_FORM_CODE= isnull(@LOAN_REPAYMENT_FORM_CODE, LOAN_REPAYMENT_FORM_CODE),
			LOAN_PURPOSE_CODE		= isnull(@LOAN_PURPOSE_CODE,		LOAN_PURPOSE_CODE),
			GRACE_PERIOD			= isnull(@GRACE_PERIOD,				GRACE_PERIOD),
			REPAYMENT_DAY			= isnull(@REPAYMENT_DAY,			REPAYMENT_DAY),
			INVENTORY_BALANCE		= isnull(@INVENTORY_BALANCE,		INVENTORY_BALANCE),
			DEBTORS_BALANCE			= isnull(@DEBTORS_BALANCE,			DEBTORS_BALANCE),
			CREDITORS_BALANCE		= isnull(@CREDITORS_BALANCE,		CREDITORS_BALANCE),
			MONTHLY_EARNING			= isnull(@MONTHLY_EARNING,			MONTHLY_EARNING),
			MONTHLY_COST			= isnull(@MONTHLY_COST,				MONTHLY_COST),
			MONTHLY_NET_INCOME		= isnull(@MONTHLY_NET_INCOME,		MONTHLY_NET_INCOME),
			PLEDGE_TYPE_CODE		= isnull(@PLEDGE_TYPE_CODE,			PLEDGE_TYPE_CODE),
			APPRAISAL_COMPANY_CODE	= isnull(@APPRAISAL_COMPANY_CODE,	APPRAISAL_COMPANY_CODE),
			BANK_BRANCH_CODE		= isnull(@BANK_BRANCH_CODE,			BANK_BRANCH_CODE)
		where ID = @APPLICATION_ID

		if @IS_SUBMIT=1
			execute dbo.sp_ChangeApplicationStatus @APPLICATION_ID, 20

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
