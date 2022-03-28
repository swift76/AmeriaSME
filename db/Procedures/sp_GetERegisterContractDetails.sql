if exists (select * from sys.objects where name='sp_GetERegisterContractDetails' and type='P')
	drop procedure dbo.sp_GetERegisterContractDetails
GO

create procedure dbo.sp_GetERegisterContractDetails(@ID	uniqueidentifier)
AS
select	e.REGISTRATION_CODE,
		e.REGISTRATION_DATE,
		e.TYPE,
		e.NAME_AM,
		e.ADDRESS,
		e.INDUSTRY_CODE,
		isnull(i.NAME_AM,'') as INDUSTRY_NAME,
		e.CERTIFICATE_CODE
from EREGISTER_QUERY_RESULT e
left join EREGISTER_INDUSTRY i
	on e.INDUSTRY_CODE = i.CODE
where e.APPLICATION_ID = @ID
GO
