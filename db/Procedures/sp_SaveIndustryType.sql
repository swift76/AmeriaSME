if exists (select * from sys.objects where name='sp_SaveIndustryType' and type='P')
	drop procedure sp_SaveIndustryType
GO

create procedure sp_SaveIndustryType(@CODE		char(4),
									@NAME_AM	nvarchar(100),
									@NAME_EN	varchar(100))
AS
	insert into INDUSTRY_TYPE (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
