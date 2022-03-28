if exists (select * from sys.objects where name='sp_GetCachedNORQLegalResponse' and type='P')
	drop procedure sp_GetCachedNORQLegalResponse
GO

create procedure sp_GetCachedNORQLegalResponse(@TAX_CODE	varchar(20))
AS
	declare @DayCount int
	select @DayCount=convert(int,VALUE) from SETTING where CODE='NORQ_CACHE_DAY'

	declare @DateTo date=getdate()
	declare @DateFrom date=dateadd(month,-@DayCount,@DateTo)

	select top 1 APPLICATION_ID,NAME,TYPE,ADDRESS,LEGAL_ADDRESS,TAX_CODE,EMPLOYEE_COUNT,REGISTRATION_DATE,REGISTRATION_CODE
	from NORQ_LEGAL_QUERY_RESULT
	where TAX_CODE=@TAX_CODE
		and convert(date,QUERY_DATE) between @DateFrom and @DateTo
	order by QUERY_DATE desc
GO
