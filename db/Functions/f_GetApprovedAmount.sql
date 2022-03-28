if exists (select * from sys.objects where name='f_GetApprovedAmount' and type='FN')
	drop function dbo.f_GetApprovedAmount
GO

create function dbo.f_GetApprovedAmount(@APPLICATION_ID	uniqueidentifier,
										@LOAN_TYPE_ID	char(2),
										@CURRENCY_CODE	char(3))
RETURNS varchar(1000)
AS
BEGIN
	declare @Result varchar(1000)

	select @Result =
		case
			when isnull(APPROVED_AMOUNT_1, 0) >= isnull(APPROVED_AMOUNT_2, 0)
				then convert(varchar(15), FORMAT(APPROVED_AMOUNT_1, '###,###,###'))
				else convert(varchar(15), FORMAT(APPROVED_AMOUNT_2, '###,###,###'))
		end
		+
		case
			when isnull(APPROVED_AMOUNT_1, 0) + isnull(APPROVED_AMOUNT_2, 0) > 0
				then ' ' + @CURRENCY_CODE
				else ''
		end
	from dbo.APPLICATION_SCORING_RESULT
	where APPLICATION_ID = @APPLICATION_ID

	return @Result
END
GO
