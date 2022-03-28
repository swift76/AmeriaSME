if exists (select * from sys.objects where name='sp_GetApplicationForNORQLegalRequestByID' and type='P')
	drop procedure sp_GetApplicationForNORQLegalRequestByID
GO

create procedure sp_GetApplicationForNORQLegalRequestByID(@ID	uniqueidentifier)
AS
	select ID,TAX_ID_NUMBER
		from APPLICATION
		where ID=@ID and STATUS_ID=1
GO
