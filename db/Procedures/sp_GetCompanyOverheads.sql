if exists (select * from sys.objects where name='sp_GetCompanyOverheads' and type='P')
	drop procedure dbo.sp_GetCompanyOverheads
GO

create procedure dbo.sp_GetCompanyOverheads(@APPLICATION_ID	uniqueidentifier,
											@LANGUAGE_CODE	char(2))
AS
	select
		a.INDUSTRY_CODE,
		case @LANGUAGE_CODE
			when 'AM' then t.NAME_AM
			else t.NAME_EN
		end as NAME,
		a.INDUSTRY_PRODUCT_CODE,
		case @LANGUAGE_CODE
			when 'AM' then p.NAME_AM
			else p.NAME_EN
		end as INDUSTRY_PRODUCT_NAME,
		a.NET_AMOUNT,
		a.SALE_AMOUNT,
		a.PRODUCT_PERCENTAGE
	from dbo.APPLICATION_COMPANY_OVERHEAD a
	join dbo.INDUSTRY_TYPE t
		on t.CODE = a.INDUSTRY_CODE
	join dbo.INDUSTRY_PRODUCT p
		on p.CODE = a.INDUSTRY_PRODUCT_CODE
	where a.APPLICATION_ID = @APPLICATION_ID
GO
