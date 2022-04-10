create or alter function f_IsCompanyTypeIE(@COMPANY_TYPE nvarchar(40))
RETURNS bit
AS
BEGIN
	declare @IS_COMPANY_IE bit
	if @COMPANY_TYPE is null
		set @IS_COMPANY_IE = 0
	else
	begin
		set @COMPANY_TYPE = upper(ltrim(rtrim(@COMPANY_TYPE)))
		set @IS_COMPANY_IE =
			case
				when left(@COMPANY_TYPE, 1) = N'Ա' and right(@COMPANY_TYPE, 1) = N'Ձ' then 1
				else 0
			end
	end

	return @IS_COMPANY_IE
END
GO
