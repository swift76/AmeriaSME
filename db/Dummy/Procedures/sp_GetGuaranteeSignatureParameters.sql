if exists (select * from sys.objects where name='sp_GetGuaranteeSignatureParameters' and type='P')
	drop procedure dbo.sp_GetGuaranteeSignatureParameters
GO

create procedure dbo.sp_GetGuaranteeSignatureParameters(@ID	uniqueidentifier)
AS
	SELECT N'Խրոնիկ վարկառու' as NAME,
	       N'ՍՊԸ' as TYPE,
		   N'Սպառող' as FIRST_NAME,
		   N'Ապառիկյան' as LAST_NAME,
		   N'' as PATRONYMIC_NAME,
		   300000 as APPROVED_AMOUNT,
		   N'ԵՎՐՈ' as CURRENCY_NAME
GO
