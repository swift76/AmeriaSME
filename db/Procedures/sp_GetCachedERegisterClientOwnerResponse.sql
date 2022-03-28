if exists (select * from sys.objects where name='sp_GetCachedERegisterClientOwnerResponse' and type='P')
	drop procedure sp_GetCachedERegisterClientOwnerResponse
GO

create procedure sp_GetCachedERegisterClientOwnerResponse(@APPLICATION_ID	uniqueidentifier)
AS
	select COUNTRY,DISTRICT,COMMUNITY,STREET,BUILDING,APARTMENT,ADDRESS,POSTAL_CODE,
			PASSPORT_NUMBER,PASSPORT_DATE,PASSPORT_EXPIRY_DATE,PASSPORT_BY,SOCIAL_CARD_NUMBER,
			BIRTH_DATE,GENDER,CITIZENSHIP_CODE,FIRST_NAME,LAST_NAME,PATRONYMIC_NAME,FULL_NAME,
			IS_FOUNDER,IS_LEGAL,JOIN_DATE,LEAVE_DATE
	from EREGISTER_CLIENT_QUERY_RESULT_OWNER
	where ID=@APPLICATION_ID
GO
