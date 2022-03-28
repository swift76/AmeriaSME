if exists (select * from sys.objects where name='sp_GetApplicationsForNORQRequest' and type='P')
	drop procedure sp_GetApplicationsForNORQRequest
GO

create procedure sp_GetApplicationsForNORQRequest
AS
	declare @NORQ_TRY_COUNT	tinyint
	select @NORQ_TRY_COUNT=convert(tinyint,VALUE)
		from SETTING
		where CODE='NORQ_TRY_COUNT'

	select ID,SOCIAL_CARD_NUMBER
	from APPLICATION
	where STATUS_ID=4 and NORQ_TRY_COUNT<@NORQ_TRY_COUNT
	order by CREATION_DATE
GO
