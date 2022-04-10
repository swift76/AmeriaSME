if exists (select * from sys.objects where name='APPLICATION' and type='U')
	drop table dbo.APPLICATION
GO

CREATE TABLE dbo.APPLICATION(
	CREATION_DATE						datetime			NOT NULL,
	ID 									uniqueidentifier	NOT NULL,
	SOURCE_ID							tinyint				NOT NULL,
	LOAN_TYPE_ID						char(2)				NULL,
	STATUS_ID							smallint			NOT NULL,
	USER_ID								int					NULL,
	LOAN_SPECIALIST_ID					int					NULL,
	TAX_ID_NUMBER						char(8)				NOT NULL,
	COMPANY_NAME						varchar(100)		NULL,
	SOCIAL_CARD_NUMBER					char(10)			NULL,
	FIRST_NAME_EN						varchar(50)			NULL,
	LAST_NAME_EN						varchar(50)			NULL,
	MOBILE_PHONE						varchar(20)			NULL,
	EMAIL								varchar(70)			NULL,
	COMPANY_EMAIL						varchar(70)			NULL,
	INITIAL_AMOUNT						money				NULL,
	CURRENCY_CODE						char(3)				NULL,
	ANNUAL_TURNOVER						money				NULL,
	FACEBOOK							nvarchar(150)		NULL,
	WEBSITE								varchar(100)		NULL,
	IS_CURRENT_ADDRESS_SAME				bit					NULL,
	CURRENT_COUNTRY_CODE				char(2)				NULL,
	CURRENT_STATE_CODE					char(3)				NULL,
	CURRENT_CITY_CODE					char(9)				NULL,
	CURRENT_STREET						nvarchar(150)		NULL,
	CURRENT_BUILDNUM					nvarchar(30)		NULL,
	CURRENT_APARTMENT					nvarchar(30)		NULL,
	IS_INDIVIDUAL_ADDRESS_SAME			bit					NULL,
	INDIVIDUAL_COUNTRY_CODE				char(2)				NULL,
	INDIVIDUAL_STATE_CODE				char(3)				NULL,
	INDIVIDUAL_CITY_CODE				char(9)				NULL,
	INDIVIDUAL_STREET					nvarchar(150)		NULL,
	INDIVIDUAL_BUILDNUM					nvarchar(30)		NULL,
	INDIVIDUAL_APARTMENT				nvarchar(30)		NULL,
	ACTIVITY_CODE						char(2)				NULL,
	FACTUAL_INDUSTRY_CODE				char(2)				NULL,

	LOAN_TERM							char(3)				NULL,
	INTEREST							money				NULL,
	LOAN_REPAYMENT_FORM_CODE			char(1)				NULL,
	LOAN_PURPOSE_CODE					char(1)				NULL,
	GRACE_PERIOD						tinyint				NULL,
	REPAYMENT_DAY						tinyint				NULL,
	INVENTORY_BALANCE					money				NULL,
	DEBTORS_BALANCE						money				NULL,
	CREDITORS_BALANCE					money				NULL,
	MONTHLY_EARNING						money				NULL,
	MONTHLY_COST						money				NULL,
	MONTHLY_NET_INCOME					money				NULL,
	PLEDGE_TYPE_CODE					char(1)				NULL,
	APPRAISAL_COMPANY_CODE				char(3)				NULL,
	BANK_BRANCH_CODE					char(3)				NULL,
	FINAL_AMOUNT						money				NULL,
	IS_REFINANCING						bit					NULL,
	IS_CORPORATE						bit					NULL,
	LOAN_TEMPLATE_CODE					char(4)				NULL,
	OVERDRAFT_TEMPLATE_CODE				char(4)				NULL,

	IS_NEW_CARD							bit					NULL,
	IS_CARD_DELIVERY					bit					NULL,
	EXISTING_CARD_CODE					char(16)			NULL,
	CREDIT_CARD_TYPE_CODE				char(3)				NULL,
	CARD_DELIVERY_ADDRESS				nvarchar(150)		NULL,
	IS_INTERNET_BANK_CHECKED			bit					NULL,
	IS_ARBITRAGE_CHECKED				bit					NULL,
	GUARANTEE_SIGNATURE_TEXT			nvarchar(max)		NULL,

	REFUSAL_REASON						nvarchar(100)		NULL,
	MANUAL_REASON						nvarchar(100)		NULL,
	IDENTIFICATION_REASON				nvarchar(100)		NULL,
	CANCELLATION_REASON_CODE			char(2)				NULL,
	CLIENT_CODE							char(8)				NULL,
	IS_DATA_COMPLETE					bit					NULL,
	ISN									int					NULL,
	TO_BE_SYNCHRONIZED					bit					NOT NULL default 0,
	NORQ_LEGAL_TRY_COUNT				tinyint				NOT NULL default 0,
	ACRA_LEGAL_TRY_COUNT				tinyint				NOT NULL default 0,
	EREGISTER_TRY_COUNT					tinyint				NOT NULL default 0,
	NORQ_TRY_COUNT						tinyint				NOT NULL default 0,
	ACRA_TRY_COUNT						tinyint				NOT NULL default 0,

	LS_LOAN_TYPE_ID						char(2)				NULL,
	LS_LOAN_AMOUNT						money				NULL,
	LS_CURRENCY_CODE					char(3)				NULL,
	LS_LOAN_TERM						char(3)				NULL,
	LS_REPAYMENT_DAY					tinyint				NULL,
	LS_ENTRY_DATE						datetime			NULL,

	BUSINESS_SPACE						money				NULL,
	BUSINESS_STATE_CODE					char(3)				NULL,
	EMPLOYEE_COUNT						int					NULL,
	FAMILY_MEMBER_COUNT					int					NULL,
	VEHICLE_COUNT						int					NULL,
	IS_AREA_RENTED						bit					NULL,
	AREA_RENTED_COMMENT					nvarchar(100)		NULL,
	ACTIVITY_DESCRIPTION				nvarchar(500)		NULL,
	SELECTED_PREAPPROVED_RESULT_ID		tinyint				NULL,
	SELECTED_PREAPPROVED_IS_REAL_ESTATE	bit					NULL,

	ECOSYSTEM_APPLICATION_ID			bigint				NULL,
	PROCESS_DATE						datetime			NULL,

	IMPORT_ID							int					NULL,
	INDIVIDUAL_CLIENT_CODE				char(8)				NULL
)
GO

CREATE UNIQUE CLUSTERED INDEX iAPPLICATION1 ON APPLICATION (ID)
GO

CREATE INDEX iAPPLICATION2 ON APPLICATION (TO_BE_SYNCHRONIZED, CREATION_DATE)
GO

CREATE INDEX iAPPLICATION3 ON APPLICATION (TAX_ID_NUMBER)
GO

CREATE INDEX iAPPLICATION4 ON APPLICATION (LOAN_SPECIALIST_ID)
GO

CREATE INDEX iAPPLICATION5 ON APPLICATION (ECOSYSTEM_APPLICATION_ID)
GO

CREATE INDEX iAPPLICATION6 ON APPLICATION (IMPORT_ID)
GO



CREATE OR ALTER TRIGGER tAPPLICATION1
   ON APPLICATION
   AFTER UPDATE
AS
BEGIN
	declare @ID uniqueidentifier,@StatusID smallint,@EcosystemApplicationID bigint,@ClientCode char(8)
	select @ID=ID,@EcosystemApplicationID=ECOSYSTEM_APPLICATION_ID from deleted
	select @StatusID=STATUS_ID,@ClientCode=CLIENT_CODE from inserted
	if @ID is not null and @StatusID in (9,17,24,55) and @EcosystemApplicationID is not null
		execute sp_ProcessEcosystemApplication @ID,@StatusID,@EcosystemApplicationID,@ClientCode
END
GO
