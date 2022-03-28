if exists (select * from sys.objects where name='sp_SaveNORQLegalTryCount' and type='P')
	drop procedure sp_SaveNORQLegalTryCount
GO

create procedure sp_SaveNORQLegalTryCount(@APPLICATION_ID	uniqueidentifier)
AS
	update APPLICATION
		set NORQ_LEGAL_TRY_COUNT=NORQ_LEGAL_TRY_COUNT+1,TO_BE_SYNCHRONIZED=1
		where ID=@APPLICATION_ID
GO
