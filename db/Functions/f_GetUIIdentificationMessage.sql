if exists (select * from sys.objects where name='f_GetUIIdentificationMessage' and type='FN')
	drop function dbo.f_GetUIIdentificationMessage
GO

create function dbo.f_GetUIIdentificationMessage(@MESSAGE	nvarchar(100))
RETURNS nvarchar(500)
AS
BEGIN
	declare @RESULT nvarchar(500)
	select @RESULT = UI_MESSAGE
		from UI_IDENTIFICATION_MESSAGE
		where MESSAGE = upper(@MESSAGE)
	set @RESULT=isnull(@RESULT,@MESSAGE)
	return @RESULT
END
GO
