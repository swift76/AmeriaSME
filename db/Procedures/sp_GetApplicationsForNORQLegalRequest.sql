if exists (select * from sys.objects where name='sp_GetApplicationsForNORQLegalRequest' and type='P')
	drop procedure sp_GetApplicationsForNORQLegalRequest
GO

create procedure sp_GetApplicationsForNORQLegalRequest
AS
	declare @NORQ_TRY_COUNT	tinyint
	select @NORQ_TRY_COUNT=convert(tinyint,VALUE)
		from SETTING
		where CODE='NORQ_TRY_COUNT'

	select ID,TAX_ID_NUMBER
		from APPLICATION
		where STATUS_ID=1 and NORQ_LEGAL_TRY_COUNT<@NORQ_TRY_COUNT
	order by CREATION_DATE
GO
