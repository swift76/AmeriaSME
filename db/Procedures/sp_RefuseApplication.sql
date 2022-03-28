if exists (select * from sys.objects where name='sp_RefuseApplication' and type='P')
	drop procedure dbo.sp_RefuseApplication
GO

create procedure dbo.sp_RefuseApplication(@APPLICATION_ID		uniqueidentifier)
AS
	BEGIN TRANSACTION
	BEGIN TRY

		declare @STATUS_ID tinyint, @LOAN_SPECIALIST_ID int, @LOAN_TYPE_ID char(2)

		select @STATUS_ID = STATUS_ID, @LOAN_SPECIALIST_ID = LOAN_SPECIALIST_ID, @LOAN_TYPE_ID = LOAN_TYPE_ID
		from dbo.APPLICATION with (updlock) where ID = @APPLICATION_ID

		if @STATUS_ID <> 8
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		execute dbo.sp_ChangeApplicationStatus @APPLICATION_ID, 30

		insert into dbo.APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@LOAN_SPECIALIST_ID, @LOAN_TYPE_ID, 'REJECTED BY LOAN SPECIALIST', @APPLICATION_ID, '')

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
