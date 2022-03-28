if exists (select * from sys.objects where name='sp_GetApplicationForNORQRequestByID' and type='P')
	drop procedure sp_GetApplicationForNORQRequestByID
GO

create procedure sp_GetApplicationForNORQRequestByID(@ID	uniqueidentifier)
AS
	select ID,SOCIAL_CARD_NUMBER
	from APPLICATION
	where ID=@ID and STATUS_ID=4
GO
