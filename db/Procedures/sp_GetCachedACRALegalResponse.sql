if exists (select * from sys.objects where name='sp_GetCachedACRALegalResponse' and type='P')
	drop procedure sp_GetCachedACRALegalResponse
GO

create procedure sp_GetCachedACRALegalResponse(@TAX_CODE	varchar(20))
AS
	declare @DayCount int
	select @DayCount=convert(int,VALUE) from SETTING where CODE='ACRA_CACHE_DAY'

	declare @DateTo date=getdate()
	declare @DateFrom date=dateadd(month,-@DayCount,@DateTo)

	select top 1 r.RESPONSE_XML
	from APPLICATION a
	join ACRA_LEGAL_QUERY_RESULT r
		on a.ID = r.APPLICATION_ID
	where a.TAX_ID_NUMBER=@TAX_CODE
		and convert(date,r.QUERY_DATE) between @DateFrom and @DateTo
	order by r.QUERY_DATE desc
GO
