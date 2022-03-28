if exists (select * from sys.objects where name='am0sp_GetLegalActiveClientCards' and type='P')
	drop procedure dbo.am0sp_GetLegalActiveClientCards
GO

create procedure dbo.am0sp_GetLegalActiveClientCards(@CLIENT	char(8),
													 @CURRENCY	char(3) = null)
AS
	select
		'9051190000000024' as CARD_NUMBER,
		N'****-****-****-0024 ԱրՔա գոլդ' as CARD_DESCRIPTION
	union all
	select
		'9051190000000020' as CARD_NUMBER,
		N'****-****-****-0020 ԱրՔա պլատինիում' as CARD_DESCRIPTION
GO
