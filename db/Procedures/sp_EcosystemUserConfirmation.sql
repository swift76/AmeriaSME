if exists (select * from sys.objects where name='sp_EcosystemUserConfirmation' and type='P')
	drop procedure dbo.sp_EcosystemUserConfirmation
GO

create procedure dbo.sp_EcosystemUserConfirmation(
	@emailConfirmationToken uniqueidentifier
)
AS
BEGIN
	BEGIN TRANSACTION

	BEGIN TRY
		IF NOT EXISTS(SELECT 1 FROM dbo.APPLICATION_USER_EMAIL_CONFIRMATION WHERE TOKEN = @emailConfirmationToken AND IS_ACTIVE = 0)
			THROW 51000, 'Incorrect token', 1

		DECLARE @userId int
		DECLARE @creationDate datetime

		SELECT @userId = APPLICATION_USER
			,@creationDate = CREATION_DATE
		FROM dbo.APPLICATION_USER_EMAIL_CONFIRMATION

		DECLARE @minutesDateDif int = DATEDIFF(minute, @creationDate, GETDATE())

		IF @minutesDateDif > 300
			THROW 51000, 'Token expired', 1

		UPDATE dbo.APPLICATION_USER_EMAIL_CONFIRMATION
		SET IS_ACTIVE = 1
		WHERE TOKEN = @emailConfirmationToken

		--Ակտիվ
		UPDATE dbo.APPLICATION_USER
		SET USER_STATE_ID = 1
		WHERE ID = @userId

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
END
GO
