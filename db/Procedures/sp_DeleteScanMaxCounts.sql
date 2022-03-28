if exists (select * from sys.objects where name='sp_DeleteScanMaxCounts' and type='P')
	drop procedure sp_DeleteScanMaxCounts
GO

create procedure sp_DeleteScanMaxCounts
AS
	truncate table SCAN_MAX_COUNT
GO
