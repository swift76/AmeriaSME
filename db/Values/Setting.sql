insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('USER_PASSWORD_EXPIRY', '90', N'Օգտագործողի գաղտնաբառի ժամկետ /օր/')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('CREDIT_CARD_AUTH_TERM', '1800', N'Պլաստիկ քարտի նույնականացման կոդի վավերականության ժամկետ /վրկ/')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('CREDIT_CARD_TRY_COUNT', '5', N'Պլաստիկ քարտի վավերացման անհաջող փորձերի քանակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('CREDIT_CARD_SMS_COUNT', '3', N'Պլաստիկ քարտի վավերացման համար ուղարկվող հաղորդագրությունների քանակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('BANK_SERVER_DATABASE', '[(LOCAL)].bank.', N'Բանկային պահոց')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('SEND_SERVER_DATABASE', '', N'SMS/Email ուղարկելու պահոց')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('FILE_MAX_SIZE', '512000', N'Վերբեռնվող ֆայլի առավելագույն չափ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('NORQ_TRY_COUNT', '5', N'NORQ հարցումների փորձերի քանակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('ACRA_TRY_COUNT', '5', N'ACRA հարցումների փորձերի քանակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('EREGISTER_TRY_COUNT', '5', N'Պետ. ռեգիստրի հարցումների փորձերի քանակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('NORQ_CHECK_BIRTH_DATE', '1', N'Ստուգել ծննդյան ամսաթիվը NORQ հարցումների ժամանակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('NORQ_WORK_MONTH', '3', N'NORQ-ով գործող աշխատանքի ժամկետ /ամիս/')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('ACRA_REPORT_TYPE', '01', N'ACRA հարցումների հաշվետվության տեսակ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('NORQ_CACHE_DAY', '0', N'NORQ-ի հարցումների կրկին օգտագործման ժամկետ /օր/')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('ACRA_CACHE_DAY', '0', N'ACRA-ի հարցումների կրկին օգտագործման ժամկետ /օր/')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('EREGISTER_CACHE_DAY', '0', N'Պետ. ռեգիստրի հարցումների կրկին օգտագործման ժամկետ /օր/')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('INDIVIDUAL_ONLINE_LOAN_PAGE', 'https://customer.ameriabank.am/Account/Login?ReturnUrl=%2F', N'Ֆիզ․ անձանց online վարկերի էջ')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('GUARANTEE_SIGNATURE_TEXT', N'Ես՝ {0} {1} {2} երաշխավորում եմ {3} {4} {5} {6} գումարի պարտավորությունը և գիտակցում եմ, որ նրա կողմից իր պարտավորությունը չկատարելու դեպքում ես եմ դրանք կատարելու, վատանալու է իմ վարկային պատմությունը և հնարավոր է զրկվեմ իմ սեփական գույքից', N'Մուտքագրվող երաշխավորության համաձայնության տեքստը')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('EVENTSTORE_SERVER_DATABASE', 'EventStore.', N'Event Store պահոց')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('ECOSYSTEM_USER_CONFIRM_EMAIL','https://localhost:3000/auth/confirm-email?token=', N'SME ecosystem հաճախորդի գրանցման համար հաստատման endpoint')
GO
insert into SETTING (CODE, VALUE, DESCRIPTION)
values ('AUTHORIZATION_CODE_TRY_COUNT', '5', N'Նույնականացման կոդի վավերացման անհաջող փորձերի քանակ')
GO
