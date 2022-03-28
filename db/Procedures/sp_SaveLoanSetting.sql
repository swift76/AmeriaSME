﻿if exists (select * from sys.objects where name='sp_SaveLoanSetting' and type='P')
	drop procedure sp_SaveLoanSetting
GO

create procedure sp_SaveLoanSetting(@REPEAT_COUNT 			int,
									@REPEAT_DAY_COUNT		tinyint,
									@EXPIRE_DAY_COUNT		tinyint,
									@CONTACT_DAY_COUNT		tinyint,
									@LS_EXPIRE_DAY_COUNT	tinyint)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		delete from LOAN_SETTING
		insert into LOAN_SETTING (REPEAT_COUNT,REPEAT_DAY_COUNT,EXPIRE_DAY_COUNT,CONTACT_DAY_COUNT,LS_EXPIRE_DAY_COUNT)
			values (@REPEAT_COUNT,@REPEAT_DAY_COUNT,@EXPIRE_DAY_COUNT,@CONTACT_DAY_COUNT,@LS_EXPIRE_DAY_COUNT)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
