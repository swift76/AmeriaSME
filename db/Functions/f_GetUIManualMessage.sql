if exists (select * from sys.objects where name='f_GetUIManualMessage' and type='FN')
	drop function dbo.f_GetUIManualMessage
GO

create function dbo.f_GetUIManualMessage(@MESSAGE	nvarchar(100))
RETURNS nvarchar(500)
AS
BEGIN
	declare @RESULT nvarchar(500)
	select @RESULT = UI_MESSAGE
		from UI_MANUAL_MESSAGE
		where MESSAGE = upper(@MESSAGE)
	set @RESULT=isnull(@RESULT,@MESSAGE)
	return @RESULT
END
GO
