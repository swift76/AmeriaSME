create or alter procedure sp_GetLegalRefinancingLoanCodes(@APPLICATION_ID	uniqueidentifier)
AS
	select ROW_ID,LOAN_CODE
	from REFINANCING_LOAN
	where APPLICATION_ID=@APPLICATION_ID
GO
