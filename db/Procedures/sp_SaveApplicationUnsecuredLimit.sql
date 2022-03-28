if exists (select * from sys.objects where name='sp_SaveApplicationUnsecuredLimit' and type='P')
	drop procedure sp_SaveApplicationUnsecuredLimit
GO

create procedure sp_SaveApplicationUnsecuredLimit(@CURRENCY		char(3),
												  @AMOUNT		money)
AS
	insert into dbo.APPLICATION_UNSECURED_LIMIT (CURRENCY, AMOUNT)
		values (@CURRENCY, @AMOUNT)
GO
