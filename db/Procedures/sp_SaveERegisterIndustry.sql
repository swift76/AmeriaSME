if exists (select * from sys.objects where name='sp_SaveERegisterIndustry' and type='P')
	drop procedure sp_SaveERegisterIndustry
GO

create procedure sp_SaveERegisterIndustry(@CODE		varchar(20),
										  @NAME_AM	nvarchar(50),
										  @NAME_EN	varchar(50))
AS
	insert into EREGISTER_INDUSTRY (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
