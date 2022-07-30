create or alter procedure sp_GetLegalApplicationMLResult(@ID	varchar(50))
AS
	select IS_REFINANCING,
		PD,
		AMOUNT
	from ML_RESULT
	where APPLICATION_ID=@ID
GO
