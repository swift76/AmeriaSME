create or alter procedure sp_ProcessApplicationProduct(
	@ID				int,
	@PROCESSED_CODE	varchar(40)
)
AS
	update APPLICATION_PRODUCT
	set PROCESSED_CODE=@PROCESSED_CODE
	where ID=@ID
GO
