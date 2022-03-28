if exists (select * from sys.objects where name='sp_SaveInitialApplication' and type='P')
	drop procedure sp_SaveInitialApplication
GO

create procedure sp_SaveInitialApplication(@LOAN_TYPE_ID				char(2),
										   @USER_ID						int				= null,
										   @LOAN_SPECIALIST_ID			int				= null,
										   @TAX_ID_NUMBER				char(8)			= null,
										   @MOBILE_PHONE				varchar(20)		= null,
										   @INITIAL_AMOUNT				money			= null,
										   @CURRENCY_CODE				char(3)			= null,
										   @ANNUAL_TURNOVER				money			= null,
										   @COMPANY_NAME				varchar(100)	= null,
										   @COMPANY_EMAIL				varchar(70)		= null,
										   @FACEBOOK					nvarchar(150)	= null,
										   @WEBSITE						varchar(100)	= null,
										   @IS_CURRENT_ADDRESS_SAME		bit				= null,
										   @CURRENT_COUNTRY_CODE		char(2)			= null,
										   @CURRENT_STATE_CODE			char(3)			= null,
										   @CURRENT_CITY_CODE			char(9)			= null,
										   @CURRENT_STREET				nvarchar(150)	= null,
										   @CURRENT_BUILDNUM			nvarchar(30)	= null,
										   @CURRENT_APARTMENT			nvarchar(30)	= null,
										   @IS_INDIVIDUAL_ADDRESS_SAME	bit				= null,
										   @INDIVIDUAL_COUNTRY_CODE		char(2)			= null,
										   @INDIVIDUAL_STATE_CODE		char(3)			= null,
										   @INDIVIDUAL_CITY_CODE		char(9)			= null,
										   @INDIVIDUAL_STREET			nvarchar(150)	= null,
										   @INDIVIDUAL_BUILDNUM			nvarchar(30)	= null,
										   @INDIVIDUAL_APARTMENT		nvarchar(30)	= null,
										   @ACTIVITY_CODE				char(2)			= null,
										   @FIRST_NAME_EN				varchar(50)		= null,
										   @LAST_NAME_EN				varchar(50)		= null,
										   @SOCIAL_CARD_NUMBER			char(10)		= null,
										   @FACTUAL_INDUSTRY_CODE		char(2)			= null,
										   @OPERATION_DETAILS			nvarchar(max),
										   @ID							uniqueidentifier	output,
										   @IS_SUBMIT					bit)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		if not @ID is null
			delete from APPLICATION where ID = @ID

		declare @EMAIL varchar(70)
		if not @USER_ID is null
		begin
			select	@TAX_ID_NUMBER = u.TAX_ID_NUMBER,
					@MOBILE_PHONE = au.MOBILE_PHONE,
					@EMAIL = au.EMAIL
			from dbo.[USER] u
			join APPLICATION_USER au
				on u.APPLICATION_USER_ID = au.ID
			where u.APPLICATION_USER_ID = @USER_ID
		end

		set @ID = newid()
		insert into APPLICATION (
			CREATION_DATE,
			ID,
			LOAN_TYPE_ID,
			STATUS_ID,
			SOURCE_ID,
			USER_ID,
			LOAN_SPECIALIST_ID,
			TAX_ID_NUMBER,
			SOCIAL_CARD_NUMBER,
			FIRST_NAME_EN,
			LAST_NAME_EN,
			INITIAL_AMOUNT,
			CURRENCY_CODE,
			ANNUAL_TURNOVER,
			FACEBOOK,
			WEBSITE,
			COMPANY_NAME,
			MOBILE_PHONE,
			EMAIL,
			COMPANY_EMAIL,
			IS_CURRENT_ADDRESS_SAME,
			CURRENT_COUNTRY_CODE,
			CURRENT_STATE_CODE,
			CURRENT_CITY_CODE,
			CURRENT_STREET,
			CURRENT_BUILDNUM,
			CURRENT_APARTMENT,
			IS_INDIVIDUAL_ADDRESS_SAME,
			INDIVIDUAL_COUNTRY_CODE,
			INDIVIDUAL_STATE_CODE,
			INDIVIDUAL_CITY_CODE,
			INDIVIDUAL_STREET,
			INDIVIDUAL_BUILDNUM,
			INDIVIDUAL_APARTMENT,
			ACTIVITY_CODE,
			FACTUAL_INDUSTRY_CODE,
			TO_BE_SYNCHRONIZED
		)
		values (
			getdate(),
			@ID,
			@LOAN_TYPE_ID,
			@IS_SUBMIT,
			1,
			@USER_ID,
			@LOAN_SPECIALIST_ID,
			@TAX_ID_NUMBER,
			@SOCIAL_CARD_NUMBER,
			@FIRST_NAME_EN,
			@LAST_NAME_EN,
			@INITIAL_AMOUNT,
			@CURRENCY_CODE,
			@ANNUAL_TURNOVER,
			@FACEBOOK,
			@WEBSITE,
			@COMPANY_NAME,
			@MOBILE_PHONE,
			@EMAIL,
			@COMPANY_EMAIL,
			@IS_CURRENT_ADDRESS_SAME,
			@CURRENT_COUNTRY_CODE,
			@CURRENT_STATE_CODE,
			@CURRENT_CITY_CODE,
			@CURRENT_STREET,
			@CURRENT_BUILDNUM,
			@CURRENT_APARTMENT,
			@IS_INDIVIDUAL_ADDRESS_SAME,
			@INDIVIDUAL_COUNTRY_CODE,
			@INDIVIDUAL_STATE_CODE,
			@INDIVIDUAL_CITY_CODE,
			@INDIVIDUAL_STREET,
			@INDIVIDUAL_BUILDNUM,
			@INDIVIDUAL_APARTMENT,
			@ACTIVITY_CODE,
			@FACTUAL_INDUSTRY_CODE,
			1
		)

		if not @USER_ID is null
			update dbo.[USER] set
				FACEBOOK				= isnull(@FACEBOOK,				FACEBOOK),
				WEBSITE					= isnull(@WEBSITE,				WEBSITE),
				COMPANY_NAME			= isnull(@COMPANY_NAME,			COMPANY_NAME),
				COMPANY_EMAIL			= isnull(@COMPANY_EMAIL,		COMPANY_EMAIL),
				ANNUAL_TURNOVER			= isnull(@ANNUAL_TURNOVER,		ANNUAL_TURNOVER),
				ACTIVITY_CODE			= isnull(@ACTIVITY_CODE,		ACTIVITY_CODE),
				IS_CURRENT_ADDRESS_SAME	= isnull(@IS_CURRENT_ADDRESS_SAME,	IS_CURRENT_ADDRESS_SAME),
				CURRENT_COUNTRY_CODE	= isnull(@CURRENT_COUNTRY_CODE,		CURRENT_COUNTRY_CODE),
				CURRENT_STATE_CODE		= isnull(@CURRENT_STATE_CODE,		CURRENT_STATE_CODE),
				CURRENT_CITY_CODE		= isnull(@CURRENT_CITY_CODE,		CURRENT_CITY_CODE),
				CURRENT_STREET			= isnull(@CURRENT_STREET,			CURRENT_STREET),
				CURRENT_BUILDNUM		= isnull(@CURRENT_BUILDNUM,			CURRENT_BUILDNUM),
				CURRENT_APARTMENT		= isnull(@CURRENT_APARTMENT,		CURRENT_APARTMENT),
				IS_INDIVIDUAL_ADDRESS_SAME	= isnull(@IS_INDIVIDUAL_ADDRESS_SAME,	IS_INDIVIDUAL_ADDRESS_SAME),
				INDIVIDUAL_COUNTRY_CODE		= isnull(@INDIVIDUAL_COUNTRY_CODE,		INDIVIDUAL_COUNTRY_CODE),
				INDIVIDUAL_STATE_CODE		= isnull(@INDIVIDUAL_STATE_CODE,		INDIVIDUAL_STATE_CODE),
				INDIVIDUAL_CITY_CODE		= isnull(@INDIVIDUAL_CITY_CODE,			INDIVIDUAL_CITY_CODE),
				INDIVIDUAL_STREET			= isnull(@INDIVIDUAL_STREET,			INDIVIDUAL_STREET),
				INDIVIDUAL_BUILDNUM			= isnull(@INDIVIDUAL_BUILDNUM,			INDIVIDUAL_BUILDNUM),
				INDIVIDUAL_APARTMENT		= isnull(@INDIVIDUAL_APARTMENT,			INDIVIDUAL_APARTMENT),
				FACTUAL_INDUSTRY_CODE		= isnull(@FACTUAL_INDUSTRY_CODE,		FACTUAL_INDUSTRY_CODE),
				FIRST_NAME_EN				= isnull(@FIRST_NAME_EN,				FIRST_NAME_EN),
				LAST_NAME_EN				= isnull(@LAST_NAME_EN,					LAST_NAME_EN),
				SOCIAL_CARD_NUMBER			= isnull(@SOCIAL_CARD_NUMBER,			SOCIAL_CARD_NUMBER)
			where APPLICATION_USER_ID = @USER_ID

		declare @OPERATION_CODE varchar(30),
				@USER_ID_FOR_LOGGING int

		if not @USER_ID is null
		begin
			select @OPERATION_CODE = 'CREATED BY USER',
				   @USER_ID_FOR_LOGGING = @USER_ID
		end
		else
		begin
			select @OPERATION_CODE = 'CREATED BY LOAN SPECIALIST',
				   @USER_ID_FOR_LOGGING = @LOAN_SPECIALIST_ID
		end

		insert into APPLICATION_OPERATION_LOG
			(USER_ID, LOAN_TYPE_ID, OPERATION_CODE, APPLICATION_ID, OPERATION_DETAILS)
		values
			(@USER_ID_FOR_LOGGING, @LOAN_TYPE_ID, @OPERATION_CODE, @ID, @OPERATION_DETAILS)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
