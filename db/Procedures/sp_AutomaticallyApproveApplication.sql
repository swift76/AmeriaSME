create or alter procedure sp_AutomaticallyApproveApplication(
	@ID						uniqueidentifier,
	@ISN					int,
	@CLIENT_CODE			char(8),
	@IDENTIFICATION_REASON	nvarchar(100)
)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @CURRENT_STATUS tinyint,@IMPORT_ID int,@USER_ID int,@TAX_ID_NUMBER char(8)

		select @CURRENT_STATUS = STATUS_ID,
			@IMPORT_ID = IMPORT_ID,
			@USER_ID = USER_ID,
			@TAX_ID_NUMBER = TAX_ID_NUMBER
		from APPLICATION with (updlock) where ID = @ID

		if @CURRENT_STATUS <> 6
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		if @IMPORT_ID>0
			SELECT @USER_ID=APPLICATION_USER_ID
				FROM [USER]
				WHERE TAX_ID_NUMBER=@TAX_ID_NUMBER

		update APPLICATION set
			STATUS_ID=8,
			TO_BE_SYNCHRONIZED=0,
			ISN=@ISN,
			CLIENT_CODE=@CLIENT_CODE,
			IDENTIFICATION_REASON=dbo.ahf_ANSI2Unicode(@IDENTIFICATION_REASON),
			USER_ID=@USER_ID
		where ID=@ID

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
