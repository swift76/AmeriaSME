if exists (select * from sys.objects where name='sp_UpdateRefinancingLoans' and type='P')
	drop procedure dbo.sp_UpdateRefinancingLoans
GO

create procedure dbo.sp_UpdateRefinancingLoans(@APPLICATION_ID	uniqueidentifier,
											   @ROW_ID 			int,
											   @LOAN_CODE		varchar(16))
AS
	update dbo.REFINANCING_LOAN
	set LOAN_CODE = @LOAN_CODE
	where APPLICATION_ID = @APPLICATION_ID and ROW_ID = @ROW_ID
GO
