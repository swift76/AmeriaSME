create or alter procedure sp_GetLegalApplicationLegalACRAPayments(@APPLICATION_ID	uniqueidentifier)
AS
	select YEAR,MONTH,
		case CUR when 'RUR' then 'RUB' else CUR end as CUR,AMOUNT
	from ACRA_LEGAL_QUERY_RESULT_PAYMENTS
	where APPLICATION_ID=@APPLICATION_ID
GO
