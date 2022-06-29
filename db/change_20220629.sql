alter table LOAN_SETTING
add
RV_EXPIRE_DAY_COUNT	tinyint	NULL
go



create or alter procedure sp_SaveLoanSetting(
	@REPEAT_COUNT 			int,
	@REPEAT_DAY_COUNT		tinyint,
	@EXPIRE_DAY_COUNT		tinyint,
	@CONTACT_DAY_COUNT		tinyint,
	@LS_EXPIRE_DAY_COUNT	tinyint,
	@RV_EXPIRE_DAY_COUNT	tinyint
)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		delete from LOAN_SETTING
		insert into LOAN_SETTING (REPEAT_COUNT,REPEAT_DAY_COUNT,EXPIRE_DAY_COUNT,CONTACT_DAY_COUNT,LS_EXPIRE_DAY_COUNT,RV_EXPIRE_DAY_COUNT)
			values (@REPEAT_COUNT,@REPEAT_DAY_COUNT,@EXPIRE_DAY_COUNT,@CONTACT_DAY_COUNT,@LS_EXPIRE_DAY_COUNT,@RV_EXPIRE_DAY_COUNT)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO



create or alter procedure sp_FinalizeDueApplications
AS
	declare @DueDays int,@RVDueDays int
	BEGIN TRY
		select @DueDays=EXPIRE_DAY_COUNT
			,@RVDueDays=isnull(RV_EXPIRE_DAY_COUNT,0)
		from LOAN_SETTING with (nolock)
		declare @CurrentDate date = convert(date,getdate())

		if @DueDays>0
			update APPLICATION
			set STATUS_ID=55,
				TO_BE_SYNCHRONIZED=1
			where STATUS_ID in (1,2,3,4,5,6,8,11,14,15,16,99)
				and datediff(day, convert(date,CREATION_DATE), @CurrentDate)>@DueDays

		if @RVDueDays>0
			update APPLICATION
			set STATUS_ID=17,
				TO_BE_SYNCHRONIZED=1
			where STATUS_ID in (10,20)
				and datediff(day, convert(date,CREATION_DATE), @CurrentDate)>@RVDueDays
	END TRY
	BEGIN CATCH

	END CATCH
GO
