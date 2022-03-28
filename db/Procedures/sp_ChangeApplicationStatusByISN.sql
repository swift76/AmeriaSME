if exists (select * from sys.objects where name='sp_ChangeApplicationStatusByISN' and type='P')
	drop procedure sp_ChangeApplicationStatusByISN
GO

create procedure sp_ChangeApplicationStatusByISN(@ISN					int,
												 @APPLICATION_STATUS_ID	smallint,
												 @REFUSAL_REASON		varchar(100))
AS
	update APPLICATION set
		STATUS_ID=@APPLICATION_STATUS_ID,
		REFUSAL_REASON=case isnull(@REFUSAL_REASON,'') when '' then REFUSAL_REASON else dbo.ahf_ANSI2Unicode(@REFUSAL_REASON) end,
		TO_BE_SYNCHRONIZED=case @APPLICATION_STATUS_ID when 6 then 1 else 0 end
	where ISN=@ISN
GO
