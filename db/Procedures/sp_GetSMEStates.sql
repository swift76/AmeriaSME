create or alter procedure sp_GetSMEStates
AS
	select convert(varchar,ID) as ID
		,dbo.ahf_Unicode2ANSI(NAME_AM) as NAME
	from APPLICATION_STATUS with (NOLOCK)
GO
