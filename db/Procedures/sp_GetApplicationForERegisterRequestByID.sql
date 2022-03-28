if exists (select * from sys.objects where name='sp_GetApplicationForERegisterRequestByID' and type='P')
	drop procedure sp_GetApplicationForERegisterRequestByID
GO

create procedure sp_GetApplicationForERegisterRequestByID(@ID	uniqueidentifier)
AS
	select A.ID,A.TAX_ID_NUMBER,isnull(N.REGISTRATION_CODE,'') as REGISTRATION_CODE
	from APPLICATION A
	left join NORQ_LEGAL_QUERY_RESULT N
		on A.ID=N.APPLICATION_ID
	where A.ID=@ID and A.STATUS_ID=2
GO
