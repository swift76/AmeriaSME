if exists (select * from sys.objects where name='sp_SaveCancellationReason' and type='P')
	drop procedure dbo.sp_SaveCancellationReason
GO

create procedure dbo.sp_SaveCancellationReason(@CODE		char(2),
												@NAME_AM	nvarchar(50),
												@NAME_EN	varchar(50))
AS
	execute sp_DeleteCancellationReason @CODE

	insert into CANCELLATION_REASON (CODE, NAME_AM, NAME_EN)
		values (@CODE, dbo.ahf_ANSI2Unicode(@NAME_AM), @NAME_EN)
GO
