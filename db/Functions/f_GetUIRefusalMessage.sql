if exists (select * from sys.objects where name='f_GetUIRefusalMessage' and type='FN')
	drop function dbo.f_GetUIRefusalMessage
GO

create function dbo.f_GetUIRefusalMessage(@MESSAGE	nvarchar(100))
RETURNS nvarchar(500)
AS
BEGIN
	declare @RESULT nvarchar(500)
	select @RESULT = UI_MESSAGE
		from UI_REFUSAL_MESSAGE
		where MESSAGE = upper(@MESSAGE)
	set @RESULT=isnull(@RESULT,@MESSAGE)
	return @RESULT
END
GO
