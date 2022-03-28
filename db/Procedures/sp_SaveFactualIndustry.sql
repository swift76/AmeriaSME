if exists (select * from sys.objects where name='sp_SaveFactualIndustry' and type='P')
	drop procedure sp_SaveFactualIndustry
GO

create procedure sp_SaveFactualIndustry(@CODE		char(2),
										@NAME_AM	nvarchar(50),
										@NAME_EN	varchar(50))
AS
	insert into FACTUAL_INDUSTRY (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
