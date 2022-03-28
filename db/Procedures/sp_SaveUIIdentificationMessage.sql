if exists (select * from sys.objects where name='sp_SaveUIIdentificationMessage' and type='P')
	drop procedure dbo.sp_SaveUIIdentificationMessage
GO

create procedure dbo.sp_SaveUIIdentificationMessage(@MESSAGE	varchar(100),
													@UI_MESSAGE	varchar(500))
AS
	insert into UI_IDENTIFICATION_MESSAGE (MESSAGE, UI_MESSAGE)
		values (upper(dbo.ahf_ANSI2Unicode(@MESSAGE)), dbo.ahf_ANSI2Unicode(@UI_MESSAGE))
GO
