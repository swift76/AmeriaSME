if exists (select * from sys.objects where name='sp_GetScanMaxCount' and type='P')
	drop procedure dbo.sp_GetScanMaxCount
GO

create procedure dbo.sp_GetScanMaxCount(@CODE char(1) = null)
AS
	select CODE, VALUE, DESCRIPTION
	from dbo.SCAN_MAX_COUNT
	where CODE = isnull(@CODE, CODE)
GO
