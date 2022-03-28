if exists (select * from sys.objects where name='sp_SaveAgreedApplication' and type='P')
	drop procedure dbo.sp_SaveAgreedApplication
GO

create procedure dbo.sp_SaveAgreedApplication (	@APPLICATION_ID 				uniqueidentifier,
												@IS_NEW_CARD					bit				= null,
												@IS_CARD_DELIVERY				bit				= null,
												@EXISTING_CARD_CODE				char(16)		= null,
												@CREDIT_CARD_TYPE_CODE			char(3)			= null,
												@CARD_DELIVERY_ADDRESS			nvarchar(150)	= null,
												@BANK_BRANCH_CODE				char(3)			= null,
												@IS_INTERNET_BANK_CHECKED		bit				= null,
												@IS_ARBITRAGE_CHECKED			bit				= null,
												@GUARANTEE_SIGNATURE_TEXT		nvarchar(max)	= null,
												@OPERATION_DETAILS				nvarchar(max),
												@IS_SUBMIT						bit)

AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @STATUS_ID tinyint, @USER_ID int, @LOAN_TYPE_ID char(2)

		select @STATUS_ID = STATUS_ID, @USER_ID = USER_ID, @LOAN_TYPE_ID = LOAN_TYPE_ID
		from dbo.APPLICATION with (updlock) where ID = @APPLICATION_ID

		if @STATUS_ID<>16
			RAISERROR (N'Հայտը պայմանագրի կնքման կարգավիճակում չէ', 17, 1)

		insert into dbo.APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@USER_ID, @LOAN_TYPE_ID, 'EDIT AGREED', @APPLICATION_ID, @OPERATION_DETAILS)

		update dbo.APPLICATION set
			IS_NEW_CARD					= isnull(@IS_NEW_CARD,					IS_NEW_CARD),
			IS_CARD_DELIVERY			= isnull(@IS_CARD_DELIVERY,				IS_CARD_DELIVERY),
			EXISTING_CARD_CODE			= isnull(@EXISTING_CARD_CODE,			EXISTING_CARD_CODE),
			CREDIT_CARD_TYPE_CODE		= isnull(@CREDIT_CARD_TYPE_CODE,		CREDIT_CARD_TYPE_CODE),
			CARD_DELIVERY_ADDRESS		= isnull(@CARD_DELIVERY_ADDRESS,		CARD_DELIVERY_ADDRESS),
			BANK_BRANCH_CODE			= isnull(@BANK_BRANCH_CODE,				BANK_BRANCH_CODE),
			IS_INTERNET_BANK_CHECKED	= isnull(@IS_INTERNET_BANK_CHECKED,		IS_INTERNET_BANK_CHECKED),
			IS_ARBITRAGE_CHECKED		= isnull(@IS_ARBITRAGE_CHECKED,			IS_ARBITRAGE_CHECKED),
			GUARANTEE_SIGNATURE_TEXT	= isnull(@GUARANTEE_SIGNATURE_TEXT,		GUARANTEE_SIGNATURE_TEXT)
		where ID = @APPLICATION_ID

		if @IS_SUBMIT=1
			execute sp_ChangeApplicationStatus @APPLICATION_ID,18

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
