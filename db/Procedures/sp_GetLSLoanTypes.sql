if exists (select * from sys.objects where name='sp_GetLSLoanTypes' and type='P')
	drop procedure dbo.sp_GetLSLoanTypes
GO

create procedure dbo.sp_GetLSLoanTypes(@LANGUAGE_CODE	char(2))
AS
	declare @CurrentDate date=getdate()
	select CODE,
		case @LANGUAGE_CODE
			when 'AM' then NAME_AM
			else NAME_EN
		end as NAME,
		case @LANGUAGE_CODE
			when 'AM' then DESCRIPTION_AM
			else DESCRIPTION_EN
		end as DESCRIPTION
	from dbo.LOAN_TYPE
	where @CurrentDate between isnull(FROM_DATE, @CurrentDate) and isnull(TO_DATE, @CurrentDate)
		and IS_LOAN_SPECIALIST=1
GO
