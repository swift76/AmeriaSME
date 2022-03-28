if exists (select * from sys.objects where name='sp_GetApplicationForNORQLegalRequestByISN' and type='P')
	drop procedure sp_GetApplicationForNORQLegalRequestByISN
GO

create procedure sp_GetApplicationForNORQLegalRequestByISN(@ISN	int)
AS
	select ID,TAX_ID_NUMBER
		from APPLICATION
		where ISN=@ISN and STATUS_ID=1
GO
