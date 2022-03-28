if exists (select * from sys.objects where name='sp_CheckUserExistenceByMobilePhone' and type='P')
	drop procedure dbo.sp_CheckUserExistenceByMobilePhone
GO

create procedure dbo.sp_CheckUserExistenceByMobilePhone (@MOBILE_PHONE	varchar(20))
AS
	select ID
	from APPLICATION_USER
	where MOBILE_PHONE = @MOBILE_PHONE
GO
