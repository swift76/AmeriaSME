create or alter procedure sp_GetLegalScoringErrors(@FROM_DATE	date,
										@TO_DATE	date)
AS
	select
		convert(char(19),DATE,121) as DATE,
		APPLICATION_ID as ID,
		OPERATION,
		dbo.ahf_Unicode2ANSI(ERROR_MESSAGE) as MESSAGE
	from SCORING_ERROR
	where convert(date,DATE) between @FROM_DATE and @TO_DATE
	order by DATE desc
GO
