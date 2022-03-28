if exists (select * from sys.objects where name='sp_SaveAppraisalCompany' and type='P')
	drop procedure dbo.sp_SaveAppraisalCompany
GO

create procedure dbo.sp_SaveAppraisalCompany(@CODE		char(3),
											 @NAME_AM	nvarchar(50),
											 @NAME_EN	varchar(50))
AS
	insert into dbo.APPRAISAL_COMPANY (CODE,NAME_AM, NAME_EN)
		values (@CODE, dbo.ahf_ANSI2Unicode(@NAME_AM), @NAME_EN)
GO
