create or alter procedure sp_GetERegisterClientQueryResultOwners(@ID	uniqueidentifier)
AS
	select PASSPORT_NUMBER,
		FULL_NAME
	from EREGISTER_CLIENT_QUERY_RESULT_OWNER
	where ID=@ID and LEAVE_DATE is null
GO
