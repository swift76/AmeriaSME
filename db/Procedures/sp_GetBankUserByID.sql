if exists (select * from sys.objects where name='sp_GetBankUserByID' and type='P')
	drop procedure sp_GetBankUserByID
GO

create procedure sp_GetBankUserByID(@ID	int)
AS
	select	u.APPLICATION_USER_ID,
			u.FIRST_NAME_AM,
			u.LAST_NAME_AM,
			au.MOBILE_PHONE,
			au.EMAIL
	from BANK_USER u
	join APPLICATION_USER au
		on u.APPLICATION_USER_ID = au.ID
	where u.APPLICATION_USER_ID = @ID
GO
