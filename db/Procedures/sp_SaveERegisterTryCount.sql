if exists (select * from sys.objects where name='sp_SaveERegisterTryCount' and type='P')
	drop procedure sp_SaveERegisterTryCount
GO

create procedure sp_SaveERegisterTryCount(@APPLICATION_ID	uniqueidentifier)
AS
	update APPLICATION
		set EREGISTER_TRY_COUNT=EREGISTER_TRY_COUNT+1,TO_BE_SYNCHRONIZED=1
		where ID=@APPLICATION_ID
GO
