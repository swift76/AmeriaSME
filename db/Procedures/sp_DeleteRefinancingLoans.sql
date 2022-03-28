if exists (select * from sys.objects where name='sp_DeleteRefinancingLoans' and type='P')
	drop procedure dbo.sp_DeleteRefinancingLoans
GO

create procedure dbo.sp_DeleteRefinancingLoans(@APPLICATION_ID	uniqueidentifier)
AS
	delete from dbo.REFINANCING_LOAN
	where APPLICATION_ID = @APPLICATION_ID
GO
