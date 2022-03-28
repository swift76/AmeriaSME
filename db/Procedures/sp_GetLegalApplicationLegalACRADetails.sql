﻿create or alter procedure sp_GetLegalApplicationLegalACRADetails(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(STATUS) as STATUS,FROM_DATE,TO_DATE,dbo.ahf_Unicode2ANSI(TYPE) as TYPE,
		case CUR when 'RUR' then 'RUB' else CUR end as CUR,
		CONTRACT_AMOUNT,DEBT,PAST_DUE_DATE,dbo.ahf_Unicode2ANSI(RISK) as RISK,CLASSIFICATION_DATE,
		INTEREST_RATE,dbo.ahf_Unicode2ANSI(PLEDGE) as PLEDGE_SUBJECT,PLEDGE_AMOUNT,IS_GUARANTEE,OUTSTANDING_AMOUNT,OUTSTANDING_PERCENT,dbo.ahf_Unicode2ANSI(BANK_NAME) as BANK_NAME,DUE_DAYS_1,DUE_DAYS_2,DUE_DAYS_3,DUE_DAYS_4,
		IS_CREDIT_LINE,IS_IGNORED_LOAN,DUE_DAYS_M1,DUE_DAYS_M2,DUE_DAYS_M3,
		dbo.ahf_Unicode2ANSI(SCOPE) as SCOPE,DUE_DAYS_MAX_Y1,DUE_DAYS_MAX_Y2,LOAN_ID
	from ACRA_LEGAL_QUERY_RESULT_DETAILS
	where APPLICATION_ID=@APPLICATION_ID
	order by IS_GUARANTEE,STATUS
GO