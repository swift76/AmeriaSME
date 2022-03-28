if exists (select * from sys.objects where name='f_IsCompanyLLC' and type='FN')
	drop function dbo.f_IsCompanyLLC
GO

create function dbo.f_IsCompanyLLC(@APPLICATION_ID	uniqueidentifier)
RETURNS bit
AS
BEGIN

	declare @COMPANY_TYPE nvarchar(40)
	select @COMPANY_TYPE = upper(ltrim(rtrim(TYPE)))
	from dbo.EREGISTER_QUERY_RESULT
	where APPLICATION_ID = @APPLICATION_ID

	declare @IS_COMPANY_LLC bit = case
									when left(@COMPANY_TYPE, 1) = N'Ա' and right(@COMPANY_TYPE, 1) = N'Ձ' then 0
									else 1
								  end

	return @IS_COMPANY_LLC
END
GO
