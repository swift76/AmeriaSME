if exists (select * from sys.objects where name='sp_CreateBankUser' and type='P')
	drop procedure sp_CreateBankUser
GO

create procedure sp_CreateBankUser(@LOGIN					varchar(50),
								   @HASH					varchar(1000),
								   @FIRST_NAME_AM			nvarchar(50),
								   @LAST_NAME_AM			nvarchar(50),
								   @MOBILE_PHONE			varchar(20),
								   @EMAIL					varchar(70),
								   @PASSWORD_EXPIRY_DATE	date,
								   @IS_ADMINISTRATOR		bit,
								   @OPERATION_DETAILS		nvarchar(max),
								   @APPLICATION_USER_ID		int)
AS
	declare @BankUserID int

	BEGIN TRANSACTION

	BEGIN TRY
		insert into APPLICATION_USER (LOGIN, HASH, PASSWORD_EXPIRY_DATE, MOBILE_PHONE, EMAIL, USER_STATE_ID, USER_ROLE_ID)
			values (@LOGIN, @HASH, @PASSWORD_EXPIRY_DATE, @MOBILE_PHONE, @EMAIL, 1, case @IS_ADMINISTRATOR when 1 then 1 else 2 end)

		set @BankUserID=SCOPE_IDENTITY()

		insert into BANK_USER (APPLICATION_USER_ID,FIRST_NAME_AM,LAST_NAME_AM)
			values (@BankUserID,@FIRST_NAME_AM,@LAST_NAME_AM)

		insert into USER_OPERATION_LOG (USER_ID,OPERATION_CODE,ENTITY_ID,OPERATION_DETAILS)
		values (@APPLICATION_USER_ID,'CREATE BANK USER',@BankUserID,@OPERATION_DETAILS)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
