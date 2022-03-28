if exists (select * from sys.objects where name='sp_SaveApplicationPreapprovedResult' and type='P')
	drop procedure sp_SaveApplicationPreapprovedResult
GO

create procedure sp_SaveApplicationPreapprovedResult(@APPLICATION_ID			uniqueidentifier,
													 @ID						tinyint,
													 @IS_REFINANCING			bit,
													 @APPROVED_AMOUNT			money,
													 @INTEREST					money,
													 @LOAN_TERM					char(3),
													 @REQUIRED_REAL_ESTATE		money,
													 @REQUIRED_MOVABLE_ESTATE	money,
													 @MONTHLY_PAYMENT_AMOUNT	money)
AS
	BEGIN TRANSACTION
	BEGIN TRY
		insert into APPLICATION_PREAPPROVED_RESULT
			(APPLICATION_ID,ID,IS_REFINANCING,APPROVED_AMOUNT,INTEREST,LOAN_TERM,REQUIRED_REAL_ESTATE,REQUIRED_MOVABLE_ESTATE,MONTHLY_PAYMENT_AMOUNT)
		values
			(@APPLICATION_ID,@ID,@IS_REFINANCING,@APPROVED_AMOUNT,@INTEREST,@LOAN_TERM,@REQUIRED_REAL_ESTATE,@REQUIRED_MOVABLE_ESTATE,@MONTHLY_PAYMENT_AMOUNT)
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
