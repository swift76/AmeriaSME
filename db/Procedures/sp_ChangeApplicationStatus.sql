if exists (select * from sys.objects where name='sp_ChangeApplicationStatus' and type='P')
	drop procedure sp_ChangeApplicationStatus
GO

create procedure sp_ChangeApplicationStatus(@APPLICATION_ID			uniqueidentifier,
											@APPLICATION_STATUS_ID	smallint,
											@TO_SYNCHRONIZE			bit = null)
AS
	declare @TO_BE_SYNCHRONIZED bit
	if @APPLICATION_STATUS_ID in (2,3,4,5,6,14,15,16,18,19,20,24,31,37)
		set @TO_BE_SYNCHRONIZED=1
	else
		set @TO_BE_SYNCHRONIZED=null

	update APPLICATION set
		STATUS_ID=@APPLICATION_STATUS_ID,
		TO_BE_SYNCHRONIZED=
			case
				when @TO_SYNCHRONIZE is null then isnull(@TO_BE_SYNCHRONIZED,TO_BE_SYNCHRONIZED)
				else @TO_SYNCHRONIZE
			end
	where ID=@APPLICATION_ID
GO
