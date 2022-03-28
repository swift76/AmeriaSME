if exists (select * from sys.objects where name='sp_ResetRequestsTryCount' and type='P')
	drop procedure sp_ResetRequestsTryCount
GO

create procedure sp_ResetRequestsTryCount(@ISN	int)
AS
	update APPLICATION set
		NORQ_LEGAL_TRY_COUNT=0,
		ACRA_LEGAL_TRY_COUNT=0,
		EREGISTER_TRY_COUNT=0,
		NORQ_TRY_COUNT=0,
		ACRA_TRY_COUNT=0
	where ISN=@ISN
GO
