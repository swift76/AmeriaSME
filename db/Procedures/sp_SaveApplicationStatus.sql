if exists (select * from sys.objects where name='sp_SaveApplicationStatus' and type='P')
	drop procedure sp_SaveApplicationStatus
GO

create procedure sp_SaveApplicationStatus(@ID	 		smallint,
										  @NAME_AM		nvarchar(80),
										  @NAME_EN		varchar(80),
										  @UI_NAME_AM	nvarchar(80) = null,
										  @UI_NAME_EN	varchar(80) = null)
AS
	BEGIN TRANSACTION

	BEGIN TRY
		delete from APPLICATION_STATUS where ID=@ID
		insert into APPLICATION_STATUS (ID,NAME_AM,NAME_EN,UI_NAME_AM,UI_NAME_EN)
			values (@ID,dbo.ahf_ANSI2Unicode(@NAME_AM),@NAME_EN,dbo.ahf_ANSI2Unicode(@UI_NAME_AM),@UI_NAME_EN)

		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
