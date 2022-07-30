create or alter procedure sp_SaveLoanUsage(
	@CODE		char(2),
	@NAME_AM	nvarchar(100),
	@NAME_EN	varchar(100)
)
AS
	insert into LOAN_USAGE (CODE,NAME_AM,NAME_EN)
		values (@CODE,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN)
GO
