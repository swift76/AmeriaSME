if exists (select * from sys.objects where name='sp_AutomaticallyRefuseApplication' and type='P')
	drop procedure sp_AutomaticallyRefuseApplication
GO

create procedure sp_AutomaticallyRefuseApplication(@ID				uniqueidentifier,
												   @REFUSAL_REASON	nvarchar(100))
AS
	update APPLICATION
	set REFUSAL_REASON=@REFUSAL_REASON
		,STATUS_ID=9
		,TO_BE_SYNCHRONIZED=1
	where ID=@ID
GO
