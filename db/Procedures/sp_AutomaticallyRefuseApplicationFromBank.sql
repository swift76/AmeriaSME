if exists (select * from sys.objects where name='sp_AutomaticallyRefuseApplicationFromBank' and type='P')
	drop procedure sp_AutomaticallyRefuseApplicationFromBank
GO

create procedure sp_AutomaticallyRefuseApplicationFromBank(@ID				uniqueidentifier,
														   @ISN				int,
														   @REFUSAL_REASON	varchar(100),
														   @CLIENT_CODE		char(8))
AS
	BEGIN TRANSACTION

	BEGIN TRY
		declare @CURRENT_STATUS tinyint

		select @CURRENT_STATUS = STATUS_ID from APPLICATION with (updlock) where ID = @ID

		if @CURRENT_STATUS <> 6
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		update APPLICATION set
			REFUSAL_REASON=dbo.ahf_ANSI2Unicode(@REFUSAL_REASON),
			STATUS_ID=9,
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
