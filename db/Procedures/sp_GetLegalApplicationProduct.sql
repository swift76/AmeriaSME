create or alter procedure sp_GetLegalApplicationProduct(@APPLICATION_ID	uniqueidentifier)
AS
	select ID,
		PRODUCT_TYPE,
		isnull(CURRENCY,'') as CURRENCY,
		isnull(CARD_TYPE,'') as CARD_TYPE,
		isnull(INTERNET_BANK_USERNAME,'') as INTERNET_BANK_USERNAME
	from APPLICATION_PRODUCT
	where APPLICATION_ID=@APPLICATION_ID
GO
