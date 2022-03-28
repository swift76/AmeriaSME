if exists (select * from sys.objects where name='sp_GetNorqContractDetails' and type='P')
	drop procedure dbo.sp_GetNorqContractDetails
GO

create procedure dbo.sp_GetNorqContractDetails(@ID	uniqueidentifier)
AS
select	FIRST_NAME as FIRST_NAME_AM,
		LAST_NAME as LAST_NAME_AM,
		PASSPORT_NUMBER as DOCUMENT_NUMBER,
		PASSPORT_BY as DOCUMENT_GIVEN_BY,
		PASSPORT_EXPIRY_DATE as DOCUMENT_EXPIRY_DATE
from dbo.NORQ_QUERY_RESULT
where APPLICATION_ID = @ID
GO
