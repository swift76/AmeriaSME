if exists (select * from sys.objects where name='f_HasCompanyMultipleOwners' and type='FN')
	drop function dbo.f_HasCompanyMultipleOwners
GO

create function dbo.f_HasCompanyMultipleOwners(@APPLICATION_ID	uniqueidentifier)
RETURNS bit
AS
BEGIN

	declare @IS_COMPANY_LLC bit = dbo.f_IsCompanyLLC(@APPLICATION_ID)
	if @IS_COMPANY_LLC = 0 -- in case of I/E the company cannot have multiple owners
		return 0

	declare @COMPANY_OWNERS_NUMBER int

	select @COMPANY_OWNERS_NUMBER = count(*)
	from dbo.EREGISTER_QUERY_RESULT_OWNER
	where APPLICATION_ID = @APPLICATION_ID and LEAVE_DATE is null

	declare @HAS_COMPANY_MULTIPLE_OWNERS bit = case
												when @COMPANY_OWNERS_NUMBER > 1 then 1
												else 0
											   end

	return @HAS_COMPANY_MULTIPLE_OWNERS
END
GO
