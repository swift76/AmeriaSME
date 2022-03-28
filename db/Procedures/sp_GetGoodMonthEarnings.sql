if exists (select * from sys.objects where name='sp_GetGoodMonthEarnings' and type='P')
	drop procedure dbo.sp_GetGoodMonthEarnings
GO

create procedure dbo.sp_GetGoodMonthEarnings(@APPLICATION_ID	uniqueidentifier,
											 @LANGUAGE_CODE		char(2))
AS
	select
		t.CODE,
		case @LANGUAGE_CODE
			when 'AM' then t.NAME_AM
			else t.NAME_EN
		end as NAME,
		a.AMOUNT,
		a.COMMENT
	from dbo.APPLICATION_GOOD_MONTH_EARNINGS a
	join dbo.INDUSTRY_TYPE t
		on t.CODE = a.INDUSTRY_CODE
	where a.APPLICATION_ID = @APPLICATION_ID
GO
