create or alter procedure sp_ProcessApplication(
	@APPLICATION_ID	uniqueidentifier,
	@CLIENT_CODE	char(8),
	@REFUSAL_REASON	nvarchar(100) = null
)
AS
	BEGIN TRANSACTION
	BEGIN TRY
		declare @STATUS_ID tinyint

		select @STATUS_ID = STATUS_ID from APPLICATION with (updlock)
		where ID = @APPLICATION_ID

		if @STATUS_ID <> 18
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		if isnull(rtrim(@REFUSAL_REASON),'')=''
			set @STATUS_ID = 24
		else
			set @STATUS_ID = 9

		update APPLICATION set
			STATUS_ID=@STATUS_ID,
			CLIENT_CODE=@CLIENT_CODE,
			REFUSAL_REASON=@REFUSAL_REASON,
			PROCESS_DATE=getdate()
		where ID=@APPLICATION_ID
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
