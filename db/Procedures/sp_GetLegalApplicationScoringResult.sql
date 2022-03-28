create or alter procedure sp_GetLegalApplicationScoringResult(@ID	varchar(50))
AS
	select SCORING_RESULT
	from SCORING_RESULT
	where APPLICATION_ID=@ID
GO
