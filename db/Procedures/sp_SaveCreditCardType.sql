if exists (select * from sys.objects where name='sp_SaveCreditCardType' and type='P')
	drop procedure sp_SaveCreditCardType
GO

create procedure sp_SaveCreditCardType(@CODE			char(3),
									   @NAME_AM			nvarchar(50),
									   @NAME_EN			varchar(50),
									   @CURRENCY_CODE	char(3))
AS
	insert into CREDIT_CARD_TYPE (CODE,NAME_AM,NAME_EN,CURRENCY_CODE)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN,@CURRENCY_CODE)
GO
