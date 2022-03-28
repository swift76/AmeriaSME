if exists (select * from sys.objects where name='sp_EmptyUIMessages' and type='P')
	drop procedure sp_EmptyUIMessages
GO

create procedure sp_EmptyUIMessages
AS
	BEGIN TRANSACTION

	BEGIN TRY
		truncate table UI_REFUSAL_MESSAGE
		truncate table UI_MANUAL_MESSAGE
		truncate table UI_IDENTIFICATION_MESSAGE

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
