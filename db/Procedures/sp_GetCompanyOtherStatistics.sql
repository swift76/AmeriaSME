if exists (select * from sys.objects where name='sp_GetCompanyOtherStatistics' and type='P')
	drop procedure dbo.sp_GetCompanyOtherStatistics
GO

create procedure dbo.sp_GetCompanyOtherStatistics(@APPLICATION_ID	uniqueidentifier,
												  @LANGUAGE_CODE	char(2))
AS
	select
		t.CODE,
		case @LANGUAGE_CODE
			when 'AM' then t.NAME_AM
			else t.NAME_EN
		end as NAME,
		a.AMOUNT,
		a.COMMENT
	from dbo.COMPANY_OTHER_STATISTICS_TYPE t
	left join dbo.APPLICATION_COMPANY_OTHER_STATISTICS a
		on t.CODE = a.COMPANY_OTHER_STATISTICS_TYPE_CODE
			and a.APPLICATION_ID = @APPLICATION_ID
GO
