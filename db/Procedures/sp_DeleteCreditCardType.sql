if exists (select * from sys.objects where name='sp_DeleteCreditCardType' and type='P')
	drop procedure sp_DeleteCreditCardType
GO

create procedure sp_DeleteCreditCardType
AS
	delete from CREDIT_CARD_TYPE
GO
