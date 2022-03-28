if exists (select * from sys.objects where name='sp_UpdateApplicationPreapprovedResult' and type='P')
	drop procedure sp_UpdateApplicationPreapprovedResult
GO

create procedure sp_UpdateApplicationPreapprovedResult(@APPLICATION_ID 				uniqueidentifier,
													   @PREAPPROVED_RESULT_ID		tinyint,
													   @PREAPPROVED_IS_REAL_ESTATE	bit)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @CURRENT_STATUS tinyint,@CURRENCY_CODE char(3),@LIMIT_AMOUNT money,@APPROVED_AMOUNT money

		select @CURRENT_STATUS = STATUS_ID,
			@CURRENCY_CODE = CURRENCY_CODE
		from APPLICATION with (updlock)
		where ID = @APPLICATION_ID

		if @CURRENT_STATUS <> 35
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		update dbo.APPLICATION
		set SELECTED_PREAPPROVED_RESULT_ID = @PREAPPROVED_RESULT_ID
			,SELECTED_PREAPPROVED_IS_REAL_ESTATE = @PREAPPROVED_IS_REAL_ESTATE
		where ID = @APPLICATION_ID

		select @APPROVED_AMOUNT=APPROVED_AMOUNT
		from APPLICATION_PREAPPROVED_RESULT
		where APPLICATION_ID=@APPLICATION_ID
			and ID=@PREAPPROVED_RESULT_ID

		select @LIMIT_AMOUNT=AMOUNT
		from APPLICATION_UNSECURED_LIMIT
		where CURRENCY=@CURRENCY_CODE

		if @APPROVED_AMOUNT<=@LIMIT_AMOUNT
			execute sp_ChangeApplicationStatus @APPLICATION_ID, 18
		else
			execute sp_ChangeApplicationStatus @APPLICATION_ID, 20

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
