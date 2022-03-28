create or alter procedure sp_GetLegalApplicationsToBeSynchronized
AS
	select ID,STATUS_ID,isnull(ISN,-1) as ISN
		,case when LOAN_SPECIALIST_ID is null then SOURCE_ID else 3 end as SOURCE_ID
		,dbo.ahf_Unicode2ANSI(isnull(REFUSAL_REASON,'')) as REFUSAL_REASON
	from APPLICATION with (NOLOCK)
	where TO_BE_SYNCHRONIZED=1
		and STATUS_ID>0
		and datediff(day,convert(date,CREATION_DATE),convert(date,getdate()))<=7
	order by CREATION_DATE
GO
