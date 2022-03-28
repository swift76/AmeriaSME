if exists (select * from sys.objects where name='sp_ProcessCorporateApplication' and type='P')
	drop procedure sp_ProcessCorporateApplication
GO

create procedure sp_ProcessCorporateApplication(@ID				uniqueidentifier,
											    @ISN			int,
											    @CLIENT_CODE	char(8))
AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @CURRENT_STATUS tinyint

		select @CURRENT_STATUS = STATUS_ID from APPLICATION with (updlock) where ID = @ID

		if @CURRENT_STATUS <> 6
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		update APPLICATION set
			STATUS_ID=13,
			TO_BE_SYNCHRONIZED=0,
			ISN=@ISN,
			CLIENT_CODE=@CLIENT_CODE
		where ID=@ID

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
