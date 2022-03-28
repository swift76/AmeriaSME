create or alter procedure sp_GetERegisterClientQueryResultExecutives(@ID	uniqueidentifier)
AS
	select PASSPORT_NUMBER,
		FULL_NAME
	from EREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE
	where ID=@ID
GO
