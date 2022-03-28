create or alter procedure sp_GetLegalApplicationACRAInterrelated(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(STATUS) as STATUS,FROM_DATE,TO_DATE,
		case CUR when 'RUR' then 'RUB' else CUR end as CUR,
		dbo.ahf_Unicode2ANSI(RISK) as RISK,CONTRACT_AMOUNT,DUE_AMOUNT,OVERDUE_AMOUNT,OUTSTANDING_PERCENT
	from ACRA_QUERY_RESULT_INTERRELATED
	where APPLICATION_ID=@APPLICATION_ID
GO
