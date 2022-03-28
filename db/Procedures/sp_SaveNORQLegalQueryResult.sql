if exists (select * from sys.objects where name='sp_SaveNORQLegalQueryResult' and type='P')
	drop procedure sp_SaveNORQLegalQueryResult
GO

create procedure sp_SaveNORQLegalQueryResult(@APPLICATION_ID	uniqueidentifier,
											 @NAME				nvarchar(100),
											 @TYPE				nvarchar(40),
											 @ADDRESS			nvarchar(100),
											 @LEGAL_ADDRESS		nvarchar(100),
											 @TAX_CODE			varchar(20),
											 @EMPLOYEE_COUNT	int,
											 @REGISTRATION_DATE	date,
											 @REGISTRATION_CODE	nvarchar(20),
											 @FOUNDERS			NORQLegalQueryResultFounder	readonly)
AS
	BEGIN TRANSACTION
	BEGIN TRY
		declare @CURRENT_STATUS tinyint

		select @CURRENT_STATUS = STATUS_ID from APPLICATION with (updlock) where ID = @APPLICATION_ID

		if @CURRENT_STATUS <> 1
			RAISERROR (N'Հայտի կարգավիճակն արդեն փոփոխվել է', 17, 1)

		insert into NORQ_LEGAL_QUERY_RESULT
			(APPLICATION_ID,NAME,TYPE,ADDRESS,LEGAL_ADDRESS,TAX_CODE,
			EMPLOYEE_COUNT,REGISTRATION_DATE,REGISTRATION_CODE)
		values
			(@APPLICATION_ID,@NAME,@TYPE,@ADDRESS,@LEGAL_ADDRESS,@TAX_CODE,
			@EMPLOYEE_COUNT,@REGISTRATION_DATE,@REGISTRATION_CODE)

		delete from NORQ_LEGAL_QUERY_RESULT_FOUNDER where APPLICATION_ID=@APPLICATION_ID
		insert into NORQ_LEGAL_QUERY_RESULT_FOUNDER
			(APPLICATION_ID,NAME,DOCUMENT_NUMBER)
		select @APPLICATION_ID,NAME,DOCUMENT_NUMBER
			from @FOUNDERS

		execute sp_ChangeApplicationStatus @APPLICATION_ID,2
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage varchar(4000)
		set @ErrorMessage = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
	COMMIT TRANSACTION
GO
