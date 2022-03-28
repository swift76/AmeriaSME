create or alter procedure sp_GetNotPrintedLegalApplications
AS
	declare @CurrentDate date = getdate()
	select ISN
	from APPLICATION
	where (not USER_ID is null)
		and STATUS_ID=24
		and datediff(day,convert(date,CREATION_DATE),@CurrentDate)<=7
GO
