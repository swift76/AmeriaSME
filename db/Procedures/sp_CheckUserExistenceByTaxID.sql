if exists (select * from sys.objects where name='sp_CheckUserExistenceByTaxID' and type='P')
	drop procedure dbo.sp_CheckUserExistenceByTaxID
GO

create procedure dbo.sp_CheckUserExistenceByTaxID (@TAX_ID_NUMBER	varchar(70))
AS
	select APPLICATION_USER_ID
	from dbo.[USER]
	where TAX_ID_NUMBER = @TAX_ID_NUMBER
GO
