if exists (select * from sys.objects where name='sp_SaveRefinancingLoan' and type='P')
	drop procedure dbo.sp_SaveRefinancingLoan
GO

create procedure dbo.sp_SaveRefinancingLoan(@APPLICATION_ID		uniqueidentifier,
											@ROW_ID 			int,
											@ORIGINAL_BANK_NAME	nvarchar(40),
											@LOAN_TYPE			nvarchar(40),
											@INITIAL_INTEREST	money,
											@CURRENCY			char(3),
											@INITIAL_AMOUNT		money,
											@CURRENT_BALANCE	money,
											@DRAWDOWN_DATE		datetime,
											@MATURITY_DATE		datetime)
AS
	insert into dbo.REFINANCING_LOAN
		(APPLICATION_ID, ROW_ID, ORIGINAL_BANK_NAME, LOAN_TYPE, INITIAL_INTEREST, CURRENCY, INITIAL_AMOUNT, CURRENT_BALANCE, DRAWDOWN_DATE, MATURITY_DATE)
	values
		(@APPLICATION_ID, @ROW_ID, dbo.ahf_ANSI2Unicode(@ORIGINAL_BANK_NAME), dbo.ahf_ANSI2Unicode(@LOAN_TYPE), @INITIAL_INTEREST, @CURRENCY, @INITIAL_AMOUNT, @CURRENT_BALANCE, @DRAWDOWN_DATE, @MATURITY_DATE)
GO
