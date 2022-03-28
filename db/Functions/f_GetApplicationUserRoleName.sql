if exists (select * from sys.objects where name='f_GetApplicationUserRoleName' and type='FN')
	drop function dbo.f_GetApplicationUserRoleName
GO

create function dbo.f_GetApplicationUserRoleName(@ID	int)
RETURNS varchar(1000)
AS
BEGIN
	declare @UserRoleID tinyint, @UserRoleName varchar(1000)

	select @UserRoleID = USER_ROLE_ID
	from dbo.APPLICATION_USER
	where ID = @ID

	set @UserRoleName =
		case @UserRoleID
			when 1 then 'BankPowerUser'
			when 2 then 'LoanSpecialist'
			when 3 then 'Customer'
			else 'EcosystemUser'
		end

	RETURN @UserRoleName
END
GO
