if exists (select * from sys.objects where name='sp_GetApplicationForNORQRequestByISN' and type='P')
	drop procedure sp_GetApplicationForNORQRequestByISN
GO

create procedure sp_GetApplicationForNORQRequestByISN(@ISN	int)
AS
	select ID,SOCIAL_CARD_NUMBER
	from APPLICATION
	where ISN=@ISN and STATUS_ID=4
GO
