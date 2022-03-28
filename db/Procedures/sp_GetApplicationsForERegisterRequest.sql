if exists (select * from sys.objects where name='sp_GetApplicationsForERegisterRequest' and type='P')
	drop procedure sp_GetApplicationsForERegisterRequest
GO

create procedure sp_GetApplicationsForERegisterRequest
AS
	declare @EREGISTER_TRY_COUNT	tinyint
	select @EREGISTER_TRY_COUNT=convert(tinyint,VALUE)
		from SETTING
		where CODE='EREGISTER_TRY_COUNT'

	select A.ID,A.TAX_ID_NUMBER,isnull(N.REGISTRATION_CODE,'') as REGISTRATION_CODE
	from APPLICATION A
	left join NORQ_LEGAL_QUERY_RESULT N
		on A.ID=N.APPLICATION_ID
	where A.STATUS_ID=2 and A.EREGISTER_TRY_COUNT<@EREGISTER_TRY_COUNT
	order by A.CREATION_DATE
GO
