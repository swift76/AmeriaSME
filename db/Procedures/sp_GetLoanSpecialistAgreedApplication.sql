create or alter procedure sp_GetLoanSpecialistAgreedApplication(@ID	uniqueidentifier)
AS
	select SELECTED_PREAPPROVED_RESULT_ID,
		SELECTED_PREAPPROVED_IS_REAL_ESTATE
	from APPLICATION
	where ID = @ID
GO
