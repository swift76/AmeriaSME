create or alter procedure sp_GetLegalNORQWork(@APPLICATION_ID	uniqueidentifier)
AS
	select dbo.ahf_Unicode2ANSI(ORGANIZATION_NAME) as ORGANIZATION_NAME
		,TAX_ID_NUMBER
		,dbo.ahf_Unicode2ANSI(ADDRESS) as ADDRESS
		,format(FROM_DATE,'dd/MM/yyyy') as FROM_DATE
		,format(TO_DATE,'dd/MM/yyyy') as TO_DATE
		,SALARY
		,SOCIAL_PAYMENT
		,dbo.ahf_Unicode2ANSI(POSITION) as POSITION
	from NORQ_QUERY_RESULT_WORK
	where APPLICATION_ID=@APPLICATION_ID
GO
