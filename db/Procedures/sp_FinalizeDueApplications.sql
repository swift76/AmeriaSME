if exists (select * from sys.objects where name='sp_FinalizeDueApplications' and type='P')
	drop procedure sp_FinalizeDueApplications
GO

create procedure sp_FinalizeDueApplications
AS
	declare @DueDays int
	BEGIN TRY
		select @DueDays=EXPIRE_DAY_COUNT from LOAN_SETTING
		declare @CurrentDate date = convert(date,getdate())

		if @DueDays>0
			update APPLICATION
			set STATUS_ID=55,
				TO_BE_SYNCHRONIZED=1
			where STATUS_ID in (1,2,3,4,5,6,8,11,14,15,16,99)
				and datediff(day, convert(date,CREATION_DATE), @CurrentDate)>@DueDays
	END TRY
	BEGIN CATCH

	END CATCH
GO
