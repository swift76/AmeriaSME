if exists (select * from sys.objects where name='sp_DeleteCancellationReason' and type='P')
	drop procedure dbo.sp_DeleteCancellationReason
GO

create procedure dbo.sp_DeleteCancellationReason(@CODE	char(2))
AS
	delete from CANCELLATION_REASON where CODE=@CODE
GO
