if exists (select * from sys.objects where name='sp_GetLoanSpecialistApplications' and type='P')
	drop procedure dbo.sp_GetLoanSpecialistApplications
GO

create procedure dbo.sp_GetLoanSpecialistApplications(@LOAN_SPECIALIST_ID	int,
													  @TAX_ID_NUMBER		char(8))
AS
	declare @CURRENT_DATE date = getdate()
	declare @REPEAT_DAY_COUNT tinyint
	select @REPEAT_DAY_COUNT = REPEAT_DAY_COUNT from LOAN_SETTING
	select a.LOAN_TYPE_ID,
		   a.CREATION_DATE,
		   convert(varchar(15), FORMAT(cast(a.INITIAL_AMOUNT as numeric), '###,###,###')) +
				' ' + isnull(a.CURRENCY_CODE,'') as DISPLAY_AMOUNT,
		   a.STATUS_ID,
		   a.COMPANY_NAME,
		   a.ID,
		   case isnull(s.UI_NAME_AM, '') when '' then s.NAME_AM else s.UI_NAME_AM end as STATUS_AM,
		   s.NAME_EN as STATUS_EN,
		   t.NAME_AM as LOAN_TYPE_AM,
		   t.NAME_EN as LOAN_TYPE_EN,
		   convert(bit,
			case
		   		when DATEDIFF(day,convert(date,a.CREATION_DATE),@CURRENT_DATE)<=@REPEAT_DAY_COUNT
		   			and (a.STATUS_ID in (10,19,20,21)
		   				or (a.LOAN_SPECIALIST_ID = @LOAN_SPECIALIST_ID and a.STATUS_ID in (0,8,30,35)))
		   		then 1
		   		else 0
			end
		   ) as IS_AVAILABLE,
		   datediff(day,convert(date,a.CREATION_DATE),@CURRENT_DATE) as TERM_DAYS,
		   isnull(b.FIRST_NAME_AM + ' ' + b.LAST_NAME_AM,'') as LOAN_SPECIALIST_NAME,
		   a.MANUAL_REASON
	from APPLICATION a with (NOLOCK)
	join APPLICATION_STATUS s with (NOLOCK)
		on a.STATUS_ID = s.ID
	join LOAN_TYPE t with (NOLOCK)
		on a.LOAN_TYPE_ID = t.CODE
	left join BANK_USER b
		on b.APPLICATION_USER_ID = a.LOAN_SPECIALIST_ID
	where a.TAX_ID_NUMBER=@TAX_ID_NUMBER
	order by a.CREATION_DATE desc
GO
