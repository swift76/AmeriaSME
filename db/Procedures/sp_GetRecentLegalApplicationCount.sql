create or alter procedure sp_GetRecentLegalApplicationCount(
	@TAX_ID_NUMBER	char(8),
	@DAY_COUNT		tinyint,
	@APPLICATION_ID	uniqueidentifier
)
AS
	declare @Result int
	declare @ToDate date = convert(date,getdate())
	declare @FromDate date = dateadd(day, -@DAY_COUNT, @ToDate)

	select @Result=count(ID)
	from APPLICATION
	where TAX_ID_NUMBER=@TAX_ID_NUMBER
		and ID<>@APPLICATION_ID
		and convert(date,CREATION_DATE) between @FromDate and @ToDate
		and not isnull(REFUSAL_REASON,'') in (N'Տվյալների անհամապատասխանություն',N'Սխալ փաստաթղթի տվյալներ',N'Համակարգային սխալ')
		and STATUS_ID<>0

	select @Result
GO
