if exists (select * from sys.objects where name='sp_GetCachedERegisterClientExecutiveResponse' and type='P')
	drop procedure sp_GetCachedERegisterClientExecutiveResponse
GO

create procedure sp_GetCachedERegisterClientExecutiveResponse(@APPLICATION_ID	uniqueidentifier)
AS
	select COUNTRY,DISTRICT,COMMUNITY,STREET,BUILDING,APARTMENT,ADDRESS,POSTAL_CODE,
			POSITION,PASSPORT_NUMBER,PASSPORT_DATE,PASSPORT_EXPIRY_DATE,PASSPORT_BY,SOCIAL_CARD_NUMBER,
			BIRTH_DATE,GENDER,CITIZENSHIP_CODE,FIRST_NAME,LAST_NAME,PATRONYMIC_NAME,FULL_NAME
	from EREGISTER_CLIENT_QUERY_RESULT_EXECUTIVE
	where ID=@APPLICATION_ID
GO