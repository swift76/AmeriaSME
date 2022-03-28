if exists (select * from sys.objects where name='sp_GetApplicationCountSetting' and type='P')
	drop procedure dbo.sp_GetApplicationCountSetting
GO

create procedure dbo.sp_GetApplicationCountSetting(@USER_ID			int,
												   @APPLICATION_ID	uniqueidentifier,
												   @LOAN_TYPE_ID	char(2))
AS
	declare @APPLICATION_COUNT int, @REPEAT_COUNT int, @REPEAT_DAY_COUNT tinyint, @TAX_ID_NUMBER char(8)
	select @REPEAT_COUNT = REPEAT_COUNT, @REPEAT_DAY_COUNT = REPEAT_DAY_COUNT
	from dbo.LOAN_SETTING

	select @TAX_ID_NUMBER = TAX_ID_NUMBER
	from dbo.[USER]
	where APPLICATION_USER_ID = @USER_ID

	declare @IS_ONLINE bit
	select @IS_ONLINE = IS_ONLINE
	from dbo.LOAN_TYPE
	where CODE = @LOAN_TYPE_ID

	if @IS_ONLINE = 1
	begin
		declare @ToDate date = convert(date,getdate())
		declare @FromDate date = dateadd(day, -@REPEAT_DAY_COUNT, @ToDate)

		select @APPLICATION_COUNT = count(ID)
		from dbo.APPLICATION
		where TAX_ID_NUMBER = @TAX_ID_NUMBER
			and (@APPLICATION_ID is null or ID <> @APPLICATION_ID)
			and convert(date, CREATION_DATE) between @FromDate and @ToDate
			and not isnull(REFUSAL_REASON, '') in (N'Տվյալների անհամապատասխանություն', N'Սխալ փաստաթղթի տվյալներ', N'Համակարգային սխալ')
			and not STATUS_ID in (0,13)
	end

	select isnull(@APPLICATION_COUNT, 0) as APPLICATION_COUNT,
		   isnull(@REPEAT_COUNT, 0) as REPEAT_COUNT,
		   isnull(@REPEAT_DAY_COUNT, 0) as REPEAT_DAY_COUNT
GO
