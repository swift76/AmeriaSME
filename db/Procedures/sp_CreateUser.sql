if exists (select * from sys.objects where name='sp_CreateUser' and type='P')
	drop procedure dbo.sp_CreateUser
GO

create procedure dbo.sp_CreateUser (@COMPANY_NAME			varchar(100),
									@TAX_ID_NUMBER			char(8),
									@MOBILE_PHONE			char(11),
									@EMAIL					varchar(50),
									@HASH					varchar(1000),
									@OPERATION_DETAILS		nvarchar(max),
									@USER_ID				int OUTPUT)

AS
	BEGIN TRANSACTION

	BEGIN TRY
		insert into APPLICATION_USER
			(LOGIN, HASH, MOBILE_PHONE, EMAIL, USER_STATE_ID, USER_ROLE_ID)
		values
			(@TAX_ID_NUMBER, @HASH, @MOBILE_PHONE, @EMAIL, 1 /* Ակտիվ */, 3 /* Հաճախորդ */)

		set @USER_ID = SCOPE_IDENTITY()

		insert into dbo.[USER] (
			APPLICATION_USER_ID,
			COMPANY_NAME,
			TAX_ID_NUMBER
		)
		values (
			@USER_ID,
			@COMPANY_NAME,
			@TAX_ID_NUMBER
		)

		insert into dbo.USER_OPERATION_LOG (
			USER_ID,
			OPERATION_CODE,
			ENTITY_ID,
			OPERATION_DETAILS
		)
		values (
			@USER_ID,
			'CREATE',
			@USER_ID,
			@OPERATION_DETAILS
		)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
GO
