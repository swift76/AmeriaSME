if exists (select * from sys.objects where name='sp_GetCompanyProfits' and type='P')
	drop procedure dbo.sp_GetCompanyProfits
GO

create procedure dbo.sp_GetCompanyProfits(@APPLICATION_ID	uniqueidentifier,
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
	from dbo.APPLICATION_COMPANY_PROFIT a
	join dbo.INDUSTRY_TYPE t
		on t.CODE = a.INDUSTRY_CODE
	where a.APPLICATION_ID = @APPLICATION_ID
GO
