if exists (select * from sys.objects where name='sp_SaveUIRefusalMessage' and type='P')
	drop procedure dbo.sp_SaveUIRefusalMessage
GO

create procedure dbo.sp_SaveUIRefusalMessage(@MESSAGE		varchar(100),
											 @UI_MESSAGE	varchar(500))
AS
	insert into UI_REFUSAL_MESSAGE (MESSAGE, UI_MESSAGE)
		values (upper(dbo.ahf_ANSI2Unicode(@MESSAGE)), dbo.ahf_ANSI2Unicode(@UI_MESSAGE))
GO
