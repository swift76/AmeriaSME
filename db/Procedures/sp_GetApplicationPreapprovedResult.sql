if exists (select * from sys.objects where name='sp_GetApplicationPreapprovedResult' and type='P')
	drop procedure dbo.sp_GetApplicationPreapprovedResult
GO

create procedure dbo.sp_GetApplicationPreapprovedResult(@APPLICATION_ID	uniqueidentifier)
AS
	declare @LS_LOAN_TERM char(3)
	select @LS_LOAN_TERM=LS_LOAN_TERM from APPLICATION where ID=@APPLICATION_ID

	SELECT ID
		,IS_REFINANCING
		,APPROVED_AMOUNT
		,INTEREST
		,LOAN_TERM
		,REQUIRED_REAL_ESTATE
		,REQUIRED_MOVABLE_ESTATE
		,MONTHLY_PAYMENT_AMOUNT
	FROM APPLICATION_PREAPPROVED_RESULT
	WHERE APPLICATION_ID = @APPLICATION_ID
	order by
		case
			when LOAN_TERM=@LS_LOAN_TERM then 0
			else LOAN_TERM
		end
GO
