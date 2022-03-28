if exists (select * from sys.objects where name='sp_SaveActivity' and type='P')
	drop procedure sp_SaveActivity
GO

create procedure sp_SaveActivity(@CODE		char(2),
								 @NAME_AM	nvarchar(50),
								 @NAME_EN	varchar(50))
AS
	insert into ACTIVITY (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
