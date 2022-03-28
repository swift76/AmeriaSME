if exists (select * from sys.objects where name='sp_GetCreditLineTypes' and type='P')
	drop procedure sp_GetCreditLineTypes
GO

create procedure sp_GetCreditLineTypes
AS
	select TYPE from ACRA_CREDIT_LINE_TYPE
GO
