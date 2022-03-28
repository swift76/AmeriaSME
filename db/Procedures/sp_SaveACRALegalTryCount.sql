if exists (select * from sys.objects where name='sp_SaveACRALegalTryCount' and type='P')
	drop procedure sp_SaveACRALegalTryCount
GO

create procedure sp_SaveACRALegalTryCount(@APPLICATION_ID	uniqueidentifier)
AS
	update APPLICATION
		set ACRA_LEGAL_TRY_COUNT=ACRA_LEGAL_TRY_COUNT+1,TO_BE_SYNCHRONIZED=1
		where ID=@APPLICATION_ID
GO
