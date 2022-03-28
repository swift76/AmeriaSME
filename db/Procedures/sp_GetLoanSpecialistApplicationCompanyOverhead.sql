create or alter procedure sp_GetLoanSpecialistApplicationCompanyOverhead(@ID	uniqueidentifier)
AS
	select INDUSTRY_CODE,
		INDUSTRY_PRODUCT_CODE,
		NET_AMOUNT,
		SALE_AMOUNT,
		PRODUCT_PERCENTAGE
	from APPLICATION_COMPANY_OVERHEAD
	where APPLICATION_ID=@ID
GO
