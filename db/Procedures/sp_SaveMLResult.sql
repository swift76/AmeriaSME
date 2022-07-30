create or alter procedure sp_SaveMLResult(
	@APPLICATION_ID	uniqueidentifier,
	@SERVICE_RESULT	varchar(max)
)
AS
	SET NOCOUNT ON

	BEGIN TRANSACTION
	BEGIN TRY
		delete from ML_RESULT where APPLICATION_ID=@APPLICATION_ID
		insert into ML_RESULT
			(APPLICATION_ID,IS_REFINANCING,PD,AMOUNT)
		select @APPLICATION_ID
			,convert(bit,case JSON_VALUE(value, '$.option') when 1 then 0 else 1 end) as IS_REFINANCING
			,convert(money,JSON_VALUE(value, '$.pd')) as PD
			,convert(money,JSON_VALUE(value, '$.amount')) as AMOUNT
		from
		(
			SELECT value FROM OpenJson(@SERVICE_RESULT)
		) as X
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
