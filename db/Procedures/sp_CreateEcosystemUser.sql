if exists (select * from sys.objects where name='sp_CreateEcosystemUser' and type='P')
	drop procedure dbo.sp_CreateEcosystemUser
GO

create procedure dbo.sp_CreateEcosystemUser(
	@email varchar(70),
	@hash varchar(1000),
	@firstNameEng varchar(50),
	@lastNameEng varchar(50),
	@emailConfirmationToken uniqueidentifier OUTPUT
)
AS
BEGIN
	BEGIN TRANSACTION

	BEGIN TRY
		INSERT INTO APPLICATION_USER(LOGIN, HASH, MOBILE_PHONE, EMAIL, USER_STATE_ID, USER_ROLE_ID)
		VALUES (@email, @hash, NULL, @email, 0 /* պասիվ */, 4 /* Ecosystem Հաճախորդ */)

		DECLARE @userId int = SCOPE_IDENTITY()

		INSERT INTO ECOSYSTEM_USER(APPLICATION_USER_ID,FIRST_NAME_EN,LAST_NAME_EN)
		VALUES(@userId,@firstNameEng,@lastNameEng)

		SET @emailConfirmationToken = NEWID()

		INSERT INTO APPLICATION_USER_EMAIL_CONFIRMATION(APPLICATION_USER,EMAIL,TOKEN,IS_ACTIVE)
		VALUES (@userId,@email,@emailConfirmationToken,0)

		DECLARE @endpoint nvarchar(max)

		SELECT @endpoint = VALUE
		FROM SETTING
		where Code='ECOSYSTEM_USER_CONFIRM_EMAIL'

		declare @SendServer nvarchar(max)
		select @SendServer=VALUE
		from SETTING
		where CODE='SEND_SERVER_DATABASE'

		DECLARE @Subject nvarchar(100) = N'SME գրանցման հաստատում'
		DECLARE @Body nvarchar(max) =
			N'<div>' +
				N'<p> Հարգելի ' + @firstNameEng + ' ' + @lastNameEng + '</p>' +
				N'<p> SME համակարգում գրանցումը հաստատելու համար խնդրում ենք անցնել <a href="' + @endpoint + Convert(nvarchar(50), @emailConfirmationToken) + N'">հղումով</a></p>' +
				N'<p> Եթե գրանցում կատարողը Դուք չեք, խնդրում ենք կապ հաստատել մեզ հետ՝ +374 10 561111</p></br>' +
				N'<p>Շնորհակալություն, Ձեր Ամերիաբանկ </p></br>' +
				N'<p>Դուք կարող եք զանգահարել 24/7 Կոնտակտ կենտրոն՝ +374 10 561111, ինչպես նաև ծանոթանալ Ամերիաբանկ ՓԲԸ կողմից տրամադրվող <a href="https://ameriabank.am/userfiles/file/Terms_and_Conditions_LP_arm_16_05_2016.pdf">ծառայություններին</a> և <a href="https://ameriabank.am/userfiles/file/Corporate_Tariffs.pdf">սակագներին</a></p>' +
			N'</div>'

		declare @SendCommand nvarchar(max)= 'EXECUTE '+@SendServer+'dbo.am0sp_SendLoanApplicationEmailSMSNotification 1,'''+@email+''','''+@Subject+''','''+@Body+''''
		execute(@SendCommand)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
	END CATCH
END
GO