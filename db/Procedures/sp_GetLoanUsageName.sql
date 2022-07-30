create or alter procedure sp_GetLoanUsageName(
	@CODE	char(2)
)
AS
	select NAME_AM from LOAN_USAGE where CODE=@CODE
GO
