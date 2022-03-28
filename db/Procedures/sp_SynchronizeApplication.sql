if exists (select * from sys.objects where name='sp_SynchronizeApplication' and type='P')
	drop procedure sp_SynchronizeApplication
GO

create procedure sp_SynchronizeApplication(@APPLICATION_ID	uniqueidentifier,
										   @ISN				int,
										   @STATUS			tinyint)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @CURRENT_STATUS tinyint

		select @CURRENT_STATUS = STATUS_ID from APPLICATION with (updlock) where ID = @APPLICATION_ID

		if @CURRENT_STATUS <> @STATUS
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		update APPLICATION set TO_BE_SYNCHRONIZED=0,ISN=@ISN where ID=@APPLICATION_ID

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
