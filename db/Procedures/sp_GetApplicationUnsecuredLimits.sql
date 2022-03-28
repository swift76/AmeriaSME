if exists (select * from sys.objects where name='sp_GetApplicationUnsecuredLimits' and type='P')
	drop procedure dbo.sp_GetApplicationUnsecuredLimits
GO

create procedure dbo.sp_GetApplicationUnsecuredLimits
AS
	select CURRENCY, AMOUNT
	from dbo.APPLICATION_UNSECURED_LIMIT
GO
