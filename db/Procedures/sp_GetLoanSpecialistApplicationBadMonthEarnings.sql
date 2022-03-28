create or alter procedure sp_GetLoanSpecialistApplicationBadMonthEarnings(@ID	uniqueidentifier)
AS
	select e.INDUSTRY_CODE,
		e.AMOUNT,
		dbo.ahf_Unicode2ANSI(isnull(e.COMMENT,'')) as COMMENT
	from APPLICATION_BAD_MONTH_EARNINGS e
	join APPLICATION_COMPANY_PROFIT p
		on e.APPLICATION_ID=p.APPLICATION_ID and e.INDUSTRY_CODE=p.INDUSTRY_CODE
	where e.APPLICATION_ID=@ID
	order by p.ID
GO
