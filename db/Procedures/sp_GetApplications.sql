if exists (select * from sys.objects where name='sp_GetApplications' and type='P')
	drop procedure dbo.sp_GetApplications
GO

create procedure dbo.sp_GetApplications(@USER_ID	int)
AS
	select a.LOAN_TYPE_ID,
		   a.CREATION_DATE,
		   convert(varchar(15), FORMAT(cast(isnull(a.FINAL_AMOUNT,a.INITIAL_AMOUNT) as numeric), '###,###,###')) +
				' ' + isnull(a.CURRENCY_CODE,'') as DISPLAY_AMOUNT,
		   a.STATUS_ID,
		   a.ID,
		   case isnull(s.UI_NAME_AM, '') when '' then s.NAME_AM else s.UI_NAME_AM end /* +
		   case
		       when a.STATUS_ID in (8,11) then ' /' + dbo.f_GetApprovedAmount(a.ID, a.LOAN_TYPE_ID, a.CURRENCY_CODE) + '/'
			   when isnull(a.REFUSAL_REASON, '') <> '' then ' /' + a.REFUSAL_REASON + '/'
			   else ''
		   end */ as STATUS_AM,
		   s.NAME_EN as STATUS_EN,
		   t.NAME_AM as LOAN_TYPE_AM,
		   t.NAME_EN as LOAN_TYPE_EN
	from dbo.APPLICATION a with (NOLOCK)
	join dbo.APPLICATION_STATUS s with (NOLOCK)
		on a.STATUS_ID = s.ID
	join dbo.LOAN_TYPE t with (NOLOCK)
		on a.LOAN_TYPE_ID = t.CODE
	where USER_ID = @USER_ID
	order by a.CREATION_DATE desc
GO
