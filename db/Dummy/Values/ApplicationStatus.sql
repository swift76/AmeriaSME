insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('0', N'', '', N'Նախնական', 'Initial')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('1', N'', '', N'Ուղարկված սքորինգի համար', 'Sent for scoring')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('2', N'', '', N'Կատարվել է NORQ հարցում (իրավաբանական)', 'NORQ query is made (legal)')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('3', N'', '', N'Կատարվել է ACRA հարցում (իրավաբանական)', 'ACRA query is made (legal)')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('4', N'', '', N'Կատարվել է պետ. ռեգիստրի հարցում', 'State register query is made')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('5', N'', '', N'Կատարվել է NORQ հարցում (ֆիզիկական)', 'NORQ query is made (individual)')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('6', N'', '', N'Կատարվել է ACRA հարցում (ֆիզիկական)', 'ACRA query is made (individual)')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('8', N'', '', N'Ավտոմատ հաստատված', 'Automatically approved')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('9', N'', '', N'Ավտոմատ մերժված', 'Automatically refused')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('10', N'', '', N'Վերստուգվող', 'To be reviewed')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('11', N'', '', N'Վերստուգված, հաստատված', 'Reviewed, approved')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('12', N'', '', N'Վերստուգված, մերժված', 'Reviewed, refused')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('13', N'', '', N'Կորպորատիվ', 'Corporate')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('14', N'', '', N'Նույնականացվող', 'To be authenticated')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('15', N'', '', N'Չնույնականացված, ուղարկված մասնաճյուղ', 'Not authenticated, sent to branch')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('16', N'', '', N'Նույնականացված', 'Authenticated')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('17', N'', '', N'Ձեռքով մերժված', 'Manually refused')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('18', N'', '', N'Հաճախորդի կողմից համաձայնեցված', 'Agreed by customer')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('19', N'', '', N'Հաճախորդի կողմից հրաժարված', 'Cancelled by customer')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('20', N'', '', N'Լրացուցիչ խմբագրված, ուղարկված մասնաճյուղ', 'Additionally edited, sent to branch')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('21', N'', '', N'Լրացուցիչ փաստաթղթերի անհրաժեշտություն', 'Additional attachments needed')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('24', N'', '', N'Տրամադրված', 'Provided')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('25', N'', '', N'Տպված', 'Printed')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('30', N'', '', N'Վարկային մասնագետի կողմից մուտքագրված', 'Entered by loan specialist')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('31', N'', '', N'Ավտոմատ մշակման ենթակա', 'To be automatically processed')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('32', N'', '', N'Բանկում հաստատման ենթակա', 'To be verified in bank')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('35', N'', '', N'Նախահաստատված վարկային բաժնի կողմից', 'Preapproved by loan department')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('36', N'', '', N'Վարկային մասնագետի կողմից մուտքագրված, ավտոմատ մերժված', 'Entered by loan specialist, automatically refused')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('37', N'', '', N'Վարկային մասնագետի կողմից մուտքագրված, հաճախորդի կողմից հրաժարված', 'Entered by loan specialist, cancelled by customer')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('55', N'', '', N'Ժամկետանց', 'Expired')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('42', N'', '', N'Բանկում հաստատման ենթակա /անգրավ/', 'To be verified in bank /unsecured/')
GO
insert into APPLICATION_STATUS (ID, UI_NAME_AM, UI_NAME_EN, NAME_AM, NAME_EN) values ('45', N'', '', N'Բանկում վերադասի կողմից հաստատման ենթակա', 'To be verified in bank by supervisor')
GO
