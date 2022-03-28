create or alter procedure sp_SaveRestrictedPassword(@PASSWORD	varchar(50))
AS
	insert into RESTRICTED_PASSWORD (PASSWORD)
		values (lower(@PASSWORD))
GO
