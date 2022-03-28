if exists (select * from sys.objects where name='sp_SaveScoringResult' and type='P')
	drop procedure sp_SaveScoringResult
GO

create procedure sp_SaveScoringResult(@APPLICATION_ID	uniqueidentifier,
									  @SCORING_RESULT	money)
AS
	BEGIN TRANSACTION
	BEGIN TRY
		delete from SCORING_RESULT where APPLICATION_ID=@APPLICATION_ID
		insert into SCORING_RESULT
			(APPLICATION_ID,SCORING_RESULT)
		values
			(@APPLICATION_ID,@SCORING_RESULT)
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
