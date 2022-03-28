alter table USER_REGISTRATION
alter column
	VERIFICATION_CODE	varchar(6)         	NOT NULL
GO



alter table USER_REGISTRATION
add
	TRY_COUNT			int					NOT NULL default 0,
	SMS_COUNT			int					NOT NULL default 1
GO



alter table USER_PASSWORD_RESET
add
	TRY_COUNT			int					NOT NULL default 0
GO



insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('AUTHORIZATION_CODE_TRY_COUNT', '5', N'Նույնականացման կոդի վավերացման անհաջող փորձերի քանակ')
GO



create or alter procedure dbo.sp_StartUserRegistration(
	@PROCESS_ID				uniqueidentifier,
	@VERIFICATION_CODE		varchar(6),
	@COMPANY_NAME			varchar(100),
	@TAX_ID_NUMBER			char(8),
	@MOBILE_PHONE			char(11),
	@EMAIL					varchar(50),
	@HASH					varchar(1000)
)
AS
	insert into dbo.USER_REGISTRATION (
		PROCESS_ID,
		VERIFICATION_CODE,
		MOBILE_PHONE,
		EMAIL,
		COMPANY_NAME,
		TAX_ID_NUMBER,
		HASH
	)
	values (
		@PROCESS_ID,
		@VERIFICATION_CODE,
		@MOBILE_PHONE,
		@EMAIL,
		@COMPANY_NAME,
		@TAX_ID_NUMBER,
		@HASH
	)
GO



create or alter procedure sp_GetUserRegistration(
	@PROCESS_ID	uniqueidentifier
)
AS
	select PROCESS_ID,
		VERIFICATION_CODE,
		MOBILE_PHONE,
		EMAIL,
		COMPANY_NAME,
		TAX_ID_NUMBER,
		HASH,
		TRY_COUNT,
		SMS_COUNT
	from USER_REGISTRATION
	where PROCESS_ID = @PROCESS_ID
GO



create or alter procedure sp_UpdateUserRegistration(
	@PROCESS_ID			uniqueidentifier,
	@VERIFICATION_CODE	varchar(6))
AS
	if exists (select *
			   from USER_REGISTRATION
			   where PROCESS_ID = @PROCESS_ID)
		update USER_REGISTRATION
		set	VERIFICATION_CODE = @VERIFICATION_CODE,
			SMS_COUNT = SMS_COUNT+1
		where PROCESS_ID = @PROCESS_ID
GO



create or alter procedure sp_SetTryUserRegistration(
	@PROCESS_ID uniqueidentifier
)
AS
	update USER_REGISTRATION
	set TRY_COUNT = TRY_COUNT+1
	where PROCESS_ID = @PROCESS_ID
GO



create or alter procedure sp_UpdateUserPassword(
	@PROCESS_ID				uniqueidentifier,
	@PHONE					varchar(20),
	@VERIFICATION_CODE_HASH	varchar(1000),
	@PASSWORD_HASH			varchar(1000)
)
AS
	IF EXISTS (
		SELECT *
		FROM USER_PASSWORD_RESET
		WHERE PROCESS_ID = @PROCESS_ID
			AND HASH = @VERIFICATION_CODE_HASH
			AND PHONE = @PHONE
			AND EXPIRES_ON > GETDATE())
		UPDATE APPLICATION_USER
		SET HASH = @PASSWORD_HASH
		WHERE MOBILE_PHONE = @PHONE
	ELSE
	begin
		declare @TRY_COUNT int,@EXPIRES_ON DATETIME,@LIMIT_COUNT int

		SELECT @TRY_COUNT=TRY_COUNT,
			@EXPIRES_ON=EXPIRES_ON
		FROM USER_PASSWORD_RESET
		WHERE PROCESS_ID = @PROCESS_ID
			AND PHONE = @PHONE

		select @LIMIT_COUNT=convert(int,VALUE)
		from SETTING
		where CODE='AUTHORIZATION_CODE_TRY_COUNT'

		if @EXPIRES_ON>GETDATE() and @TRY_COUNT<@LIMIT_COUNT
			update USER_PASSWORD_RESET
			set TRY_COUNT=TRY_COUNT+1
			WHERE PROCESS_ID = @PROCESS_ID
				AND PHONE = @PHONE;

		THROW 51000, N'Օգտագործողի նշանաբանը փոխելու ընթացքում սխալ է առաջացել', 1
	end
GO
