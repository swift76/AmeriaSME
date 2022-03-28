if exists (select * from sys.objects where name='sp_DeleteApplication' and type='P')
	drop procedure dbo.sp_DeleteApplication
GO

create procedure dbo.sp_DeleteApplication(@ID					uniqueidentifier,
										  @OPERATION_DETAILS	nvarchar(max))

AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @STATUS_ID tinyint, @USER_ID int, @LOAN_TYPE_ID char(2)

		select @STATUS_ID = STATUS_ID, @USER_ID = USER_ID, @LOAN_TYPE_ID = LOAN_TYPE_ID
		from dbo.APPLICATION with (updlock)
		where ID = @ID

		if @STATUS_ID <> 0
			RAISERROR (N'Հայտը նախնական կարգավիճակում չէ', 17, 1)

		insert into dbo.APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@USER_ID, @LOAN_TYPE_ID, 'DELETE', @ID, @OPERATION_DETAILS)

		delete from dbo.APPLICATION where ID = @ID

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
