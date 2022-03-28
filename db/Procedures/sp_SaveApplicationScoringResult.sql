if exists (select * from sys.objects where name='sp_SaveApplicationScoringResult' and type='P')
	drop procedure sp_SaveApplicationScoringResult
GO

create procedure sp_SaveApplicationScoringResult(@APPLICATION_ID		uniqueidentifier,
												 @APPROVED_AMOUNT_1		money,
												 @APPROVED_AMOUNT_2		money,
												 @INTEREST				money,
												 @REFINANCING_AMOUNT	money)
AS
	delete from APPLICATION_SCORING_RESULT where APPLICATION_ID=@APPLICATION_ID

	insert into APPLICATION_SCORING_RESULT
		(APPLICATION_ID,APPROVED_AMOUNT_1,APPROVED_AMOUNT_2,INTEREST,REFINANCING_AMOUNT)
	values
		(@APPLICATION_ID,@APPROVED_AMOUNT_1,@APPROVED_AMOUNT_2,@INTEREST,@REFINANCING_AMOUNT)
GO
