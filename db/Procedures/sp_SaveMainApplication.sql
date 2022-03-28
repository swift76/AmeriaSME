create or alter procedure dbo.sp_SaveMainApplication(
	@APPLICATION_ID 			uniqueidentifier,
	@FINAL_AMOUNT				money			= null,
	@INTEREST					money			= null,
	@REPAYMENT_DAY				tinyint			= null,
	@LOAN_TERM					char(3)			= null,
	@IS_REFINANCING				bit				= null,
	@LOAN_TEMPLATE_CODE			char(4)			= null,
	@OVERDRAFT_TEMPLATE_CODE	char(4)			= null,
	@OPERATION_DETAILS			nvarchar(max),
	@IS_SUBMIT					bit
)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @STATUS_ID tinyint, @USER_ID int, @LOAN_TYPE_ID char(2), @IDENTIFICATION_REASON nvarchar(100), @IMPORT_ID int

		select @STATUS_ID = STATUS_ID, @USER_ID = USER_ID, @LOAN_TYPE_ID = LOAN_TYPE_ID, @IDENTIFICATION_REASON = IDENTIFICATION_REASON
			, @IMPORT_ID = IMPORT_ID
		from dbo.APPLICATION with (updlock) where ID = @APPLICATION_ID

		if @STATUS_ID<>8
			RAISERROR (N'Հայտը տվյալների լրացման կարգավիճակում չէ', 17, 1)

		insert into dbo.APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@USER_ID, @LOAN_TYPE_ID, 'EDIT AUTOMATICALLY', @APPLICATION_ID, @OPERATION_DETAILS)

		update dbo.APPLICATION set
			FINAL_AMOUNT			= isnull(@FINAL_AMOUNT,				FINAL_AMOUNT),
			INTEREST				= isnull(@INTEREST,					INTEREST),
			REPAYMENT_DAY			= isnull(@REPAYMENT_DAY,			REPAYMENT_DAY),
			LOAN_TERM				= isnull(@LOAN_TERM,				LOAN_TERM),
			IS_REFINANCING			= isnull(@IS_REFINANCING,			IS_REFINANCING),
			LOAN_TEMPLATE_CODE		= isnull(@LOAN_TEMPLATE_CODE,		LOAN_TEMPLATE_CODE),
			OVERDRAFT_TEMPLATE_CODE	= isnull(@OVERDRAFT_TEMPLATE_CODE,	OVERDRAFT_TEMPLATE_CODE)
		where ID = @APPLICATION_ID

		if @IS_SUBMIT = 1
		begin
			if isnull(@IDENTIFICATION_REASON,'')=''
				execute dbo.sp_ChangeApplicationStatus @APPLICATION_ID, 14 -- authenticated
			else
				execute dbo.sp_ChangeApplicationStatus @APPLICATION_ID, 15 -- not authenticated, sent to branch

			if @IMPORT_ID>0
				update APPLICATION
					set STATUS_ID=19,TO_BE_SYNCHRONIZED=1
				where IMPORT_ID=@IMPORT_ID and ID<>@APPLICATION_ID
		end

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
