if exists (select * from sys.objects where name='RESTRICTED_PASSWORD' and type='U')
	drop table RESTRICTED_PASSWORD
GO

CREATE TABLE RESTRICTED_PASSWORD(
	ID			int			NOT NULL identity(1,1),
	PASSWORD	varchar(50)	NOT NULL
)
GO

CREATE CLUSTERED INDEX iRESTRICTED_PASSWORD1 ON RESTRICTED_PASSWORD(ID)
GO
CREATE UNIQUE INDEX iRESTRICTED_PASSWORD2 ON RESTRICTED_PASSWORD(PASSWORD)
GO



create or alter procedure sp_DeleteRestrictedPasswords
AS
	delete from RESTRICTED_PASSWORD
GO



create or alter procedure sp_SaveRestrictedPassword(@PASSWORD	varchar(50))
AS
	insert into RESTRICTED_PASSWORD (PASSWORD)
		values (lower(@PASSWORD))
GO



create or alter procedure sp_GetRestrictedPasswords
AS
	select PASSWORD from RESTRICTED_PASSWORD
GO
