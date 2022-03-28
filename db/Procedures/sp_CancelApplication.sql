if exists (select * from sys.objects where name='sp_CancelApplication' and type='P')
	drop procedure dbo.sp_CancelApplication
GO

create procedure dbo.sp_CancelApplication(@APPLICATION_ID			uniqueidentifier,
										  @CANCELLATION_REASON_CODE	char(2),
										  @OPERATION_DETAILS		nvarchar(max))
AS
	BEGIN TRANSACTION
	BEGIN TRY

		declare @STATUS_ID tinyint, @USER_ID int, @LOAN_TYPE_ID char(2)

		select @STATUS_ID = STATUS_ID, @USER_ID = USER_ID, @LOAN_TYPE_ID = LOAN_TYPE_ID
		from dbo.APPLICATION with (updlock) where ID = @APPLICATION_ID

		if not @STATUS_ID in (8, 11, 10, 20, 21, 13, 14, 15, 16, 30, 35)
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		update dbo.APPLICATION
		set CANCELLATION_REASON_CODE = @CANCELLATION_REASON_CODE
		where ID = @APPLICATION_ID

		if @STATUS_ID in (30, 35)
			execute dbo.sp_ChangeApplicationStatus @APPLICATION_ID, 37
		else
			execute dbo.sp_ChangeApplicationStatus @APPLICATION_ID, 19

		insert into dbo.APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@USER_ID, @LOAN_TYPE_ID, 'CANCELLED BY USER', @APPLICATION_ID, @OPERATION_DETAILS)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
