if exists (select * from sys.objects where name='sp_GetApplicationScoringResultByType' and type='P')
	drop procedure dbo.sp_GetApplicationScoringResultByType
GO

create procedure dbo.sp_GetApplicationScoringResultByType(@APPLICATION_ID	uniqueidentifier)
AS
	SELECT r.APPROVED_AMOUNT_1,
		   r.APPROVED_AMOUNT_2,
		   r.REFINANCING_AMOUNT,
		   r.INTEREST,
		   t.TERM_FROM,
		   t.TERM_TO,
		   t.TEMPLATE_CODE,
		   t.TEMPLATE_NAME
	FROM dbo.APPLICATION_SCORING_RESULT r
	JOIN dbo.APPLICATION a
		ON a.ID=r.APPLICATION_ID
	JOIN dbo.AGREEMENT_TEMPLATE_BY_TYPE t
		ON a.LOAN_TYPE_ID = t.LOAN_TYPE_ID and a.CURRENCY_CODE = t.CURRENCY_CODE
	WHERE r.APPLICATION_ID = @APPLICATION_ID and t.WAY_ID=1
GO