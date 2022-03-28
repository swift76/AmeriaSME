if exists (select * from sys.objects where name='sp_GetSettings' and type='P')
	drop procedure sp_GetSettings
GO

create procedure sp_GetSettings(@CODE varchar(30) = null)
AS
	select CODE, VALUE, DESCRIPTION
	from SETTING
	where CODE = isnull(@CODE,CODE)
GO
