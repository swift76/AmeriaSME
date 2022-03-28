if exists (select * from sys.objects where name='sp_InsertAgreementTemplateByType' and type='P')
	drop procedure sp_InsertAgreementTemplateByType
GO

create procedure sp_InsertAgreementTemplateByType(@LOAN_TYPE_ID		char(2),
												  @CURRENCY_CODE	char(3),
												  @TEMPLATE_CODE	char(4),
												  @TEMPLATE_NAME	nvarchar(50),
												  @INTEREST			money,
												  @TERM_FROM		int,
												  @TERM_TO			int,
												  @WAY_ID			tinyint)
AS
	insert into AGREEMENT_TEMPLATE_BY_TYPE (LOAN_TYPE_ID,CURRENCY_CODE,TEMPLATE_CODE,TEMPLATE_NAME,INTEREST,TERM_FROM,TERM_TO,WAY_ID)
	values (@LOAN_TYPE_ID,@CURRENCY_CODE,@TEMPLATE_CODE,@TEMPLATE_NAME,@INTEREST,@TERM_FROM,@TERM_TO,@WAY_ID)
GO
