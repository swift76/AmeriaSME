if exists (select * from sys.objects where name='sp_GetGuaranteeSignatureParameters' and type='P')
	drop procedure dbo.sp_GetGuaranteeSignatureParameters
GO

create procedure dbo.sp_GetGuaranteeSignatureParameters(@ID	uniqueidentifier)
AS
	SELECT l.NAME,l.TYPE,i.FIRST_NAME,i.LAST_NAME,i.PATRONYMIC_NAME
	FROM NORQ_LEGAL_QUERY_RESULT l
	JOIN NORQ_QUERY_RESULT i
		on l.APPLICATION_ID=i.APPLICATION_ID
	where l.APPLICATION_ID = @ID
GO
