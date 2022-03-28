if exists (select * from sys.objects where name='sp_GetApplicationContractDetails' and type='P')
	drop procedure dbo.sp_GetApplicationContractDetails
GO

create procedure dbo.sp_GetApplicationContractDetails(@ID	uniqueidentifier)
AS
select	a.CREATION_DATE,
		a.CLIENT_CODE,
		a.SOCIAL_CARD_NUMBER,
		a.TAX_ID_NUMBER,
		a.LOAN_TYPE_ID,
		case lt.IS_OVERDRAFT when 1 then a.OVERDRAFT_TEMPLATE_CODE else a.LOAN_TEMPLATE_CODE end as TEMPLATE_CODE,
		isnull(cc.NAME_AM,'') as CURRENT_COUNTRY_NAME,
		isnull(ccty.NAME_AM,'') as CURRENT_CITY_NAME,
		isnull(cst.NAME_AM,'') as CURRENT_STATE_NAME,
		isnull(a.CURRENT_STREET,'') as CURRENT_STREET,
		isnull(a.CURRENT_BUILDNUM,'') as CURRENT_BUILDNUM,
		isnull(a.CURRENT_APARTMENT,'') as CURRENT_APARTMENT,
		isnull(icc.NAME_AM,'') as INDIVIDUAL_COUNTRY_NAME,
		isnull(iccty.NAME_AM,'') as INDIVIDUAL_CITY_NAME,
		isnull(icst.NAME_AM,'') as INDIVIDUAL_STATE_NAME,
		isnull(a.INDIVIDUAL_STREET,'') as INDIVIDUAL_STREET,
		isnull(a.INDIVIDUAL_BUILDNUM,'') as INDIVIDUAL_BUILDNUM,
		isnull(a.INDIVIDUAL_APARTMENT,'') as INDIVIDUAL_APARTMENT,
		a.MOBILE_PHONE,
		a.EMAIL,
		a.FACEBOOK,
		a.WEBSITE,
		fi.NAME_AM as FACTUAL_INDUSTRY_NAME,
		a.ANNUAL_TURNOVER,
		a.LOAN_TERM,
		a.INITIAL_AMOUNT,
		ll.NAME_AM as CURRENCY_NAME,
		a.REPAYMENT_DAY,
		a.FINAL_AMOUNT,
		a.INTEREST,
		a.IS_REFINANCING,
		coalesce(a.IS_NEW_CARD, 0) as IS_NEW_CARD,
		case when coalesce(a.IS_NEW_CARD, 0) = 0 then a.EXISTING_CARD_CODE else null end as EXISTING_CARD_CODE,
		case when coalesce(a.IS_NEW_CARD, 0) = 1 and lt.IS_OVERDRAFT = 1 then ct.NAME_AM else null end as NEW_CARD_TYPE_NAME,
		case when coalesce(a.IS_NEW_CARD, 0) = 1 and coalesce(a.IS_CARD_DELIVERY, 0) = 0 then bb.NAME_AM else null end as CARD_DELIVERY_BANK_BRANCH_NAME,
		case when coalesce(a.IS_NEW_CARD, 0) = 1 and coalesce(a.IS_CARD_DELIVERY, 0) = 1 then a.CARD_DELIVERY_ADDRESS else null end as CARD_DELIVERY_ADDRESS
from dbo.APPLICATION a
join dbo.LOAN_TYPE lt
	on a.LOAN_TYPE_ID = lt.CODE
join dbo.LOAN_LIMIT ll
	on a.LOAN_TYPE_ID = ll.LOAN_TYPE_CODE and a.CURRENCY_CODE = ll.CURRENCY
join dbo.FACTUAL_INDUSTRY fi
	on a.FACTUAL_INDUSTRY_CODE = fi.CODE
left join dbo.COUNTRY cc
	on a.CURRENT_COUNTRY_CODE = cc.CODE
left join dbo.STATE cst
	on a.CURRENT_STATE_CODE = cst.CODE
left join dbo.CITY ccty
	on a.CURRENT_CITY_CODE = ccty.CODE
left join dbo.COUNTRY icc
	on a.INDIVIDUAL_COUNTRY_CODE = icc.CODE
left join dbo.STATE icst
	on a.INDIVIDUAL_STATE_CODE = icst.CODE
left join dbo.CITY iccty
	on a.INDIVIDUAL_CITY_CODE = iccty.CODE
left join dbo.BANK_BRANCH bb
	on a.BANK_BRANCH_CODE = bb.CODE
left join dbo.CREDIT_CARD_TYPE ct
	on a.CURRENCY_CODE = ct.CURRENCY_CODE and a.CREDIT_CARD_TYPE_CODE = ct.CODE
where a.ID = @ID
GO
