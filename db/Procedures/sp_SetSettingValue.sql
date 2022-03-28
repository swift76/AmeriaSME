if exists (select * from sys.objects where name='sp_SetSettingValue' and type='P')
	drop procedure sp_SetSettingValue
GO

create procedure sp_SetSettingValue(@CODE	varchar(30),
									@VALUE	nvarchar(max))
AS
	update SETTING
	set VALUE = @VALUE
	where CODE = @CODE
GO
