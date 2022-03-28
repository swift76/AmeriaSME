create or alter procedure sp_ProcessEcosystemOwner(
	@ID				int,
	@CLIENT_CODE	char(8)
)
AS
	update ECOSYSTEM_OWNER
	set CLIENT_CODE=@CLIENT_CODE
	where ID=@ID
GO
