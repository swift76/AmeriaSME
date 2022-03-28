if exists (select * from sys.objects where name='sp_GetCreditCardTypes' and type='P')
	drop procedure dbo.sp_GetCreditCardTypes
GO

create procedure dbo.sp_GetCreditCardTypes(@LANGUAGE_CODE	char(2),
										   @CURRENCY_CODE	char(3))
AS
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME
	from dbo.CREDIT_CARD_TYPE
	where CURRENCY_CODE = @CURRENCY_CODE
GO
