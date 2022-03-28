if exists (select * from sys.objects where name='sp_SaveBusinessStateType' and type='P')
	drop procedure sp_SaveBusinessStateType
GO

create procedure sp_SaveBusinessStateType(@CODE		char(3),
										  @NAME_AM	nvarchar(50),
										  @NAME_EN	varchar(50))
AS
	insert into BUSINESS_STATE_TYPE (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
