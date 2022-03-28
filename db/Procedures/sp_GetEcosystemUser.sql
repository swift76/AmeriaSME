if exists (select * from sys.objects where name='sp_GetEcosystemUser' and type='P')
	drop procedure dbo.sp_GetEcosystemUser
GO

CREATE procedure dbo.sp_GetEcosystemUser(@applicationUserId int)
AS
SELECT APPLICATION_USER_ID
      ,FIRST_NAME_EN
      ,LAST_NAME_EN
  FROM dbo.ECOSYSTEM_USER
  WHERE APPLICATION_USER_ID = @applicationUserId
GO
