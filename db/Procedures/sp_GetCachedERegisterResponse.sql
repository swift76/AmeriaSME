if exists (select * from sys.objects where name='sp_GetCachedERegisterResponse' and type='P')
	drop procedure sp_GetCachedERegisterResponse
GO

create procedure sp_GetCachedERegisterResponse(@TAX_CODE	varchar(20))
AS
	declare @DayCount int
	select @DayCount=convert(int,VALUE) from SETTING where CODE='EREGISTER_CACHE_DAY'

	declare @DateTo date=getdate()
	declare @DateFrom date=dateadd(month,-@DayCount,@DateTo)

	select top 1 APPLICATION_ID,COUNTRY,DISTRICT,COMMUNITY,STREET,BUILDING,APARTMENT,ADDRESS,POSTAL_CODE,
		CERTIFICATE_CODE,REGISTRATION_CODE,REGISTRATION_DATE,TYPE,IS_ACTIVE,INDUSTRY_CODE,NAME_AM,NAME_EN,NAME_RU
		,QUERY_SOURCE
	from
	(
		select top 1 r.APPLICATION_ID,r.COUNTRY,r.DISTRICT,r.COMMUNITY,r.STREET,r.BUILDING,r.APARTMENT,r.ADDRESS,r.POSTAL_CODE,
			r.CERTIFICATE_CODE,r.REGISTRATION_CODE,r.REGISTRATION_DATE,r.TYPE,r.IS_ACTIVE,r.INDUSTRY_CODE,r.NAME_AM,r.NAME_EN,r.NAME_RU
			,r.QUERY_DATE,convert(tinyint,1) as QUERY_SOURCE
		from APPLICATION a
		join EREGISTER_QUERY_RESULT r
			on a.ID = r.APPLICATION_ID
		where a.TAX_ID_NUMBER=@TAX_CODE
			and convert(date,r.QUERY_DATE) between @DateFrom and @DateTo
		order by r.QUERY_DATE desc

		union all

		select top 1 ID as APPLICATION_ID,COUNTRY,DISTRICT,COMMUNITY,STREET,BUILDING,APARTMENT,ADDRESS,POSTAL_CODE,
			CERTIFICATE_CODE,REGISTRATION_CODE,REGISTRATION_DATE,TYPE,IS_ACTIVE,INDUSTRY_CODE,NAME_AM,NAME_EN,NAME_RU
			,QUERY_DATE,convert(tinyint,2) as QUERY_SOURCE
		from EREGISTER_CLIENT_QUERY_RESULT
		where TAX_NUMBER=@TAX_CODE
			and convert(date,QUERY_DATE) between @DateFrom and @DateTo
		order by QUERY_DATE desc
	) as X
	order by QUERY_DATE desc
GO
