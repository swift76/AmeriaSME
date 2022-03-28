if exists (select * from sys.objects where name='sp_SaveLoanPurpose' and type='P')
	drop procedure sp_SaveLoanPurpose
GO

create procedure sp_SaveLoanPurpose(@CODE			char(1),
									@NAME_AM		nvarchar(50),
									@NAME_EN		varchar(50),
									@DESCRIPTION_AM	nvarchar(max) = '',
									@DESCRIPTION_EN	varchar(max) = '')
AS
	BEGIN TRANSACTION

	BEGIN TRY
		delete from LOAN_PURPOSE where CODE = @CODE

		insert into LOAN_PURPOSE (
			CODE,
			NAME_AM,
			NAME_EN,
			DESCRIPTION_AM,
			DESCRIPTION_EN
		)
		values (
			@CODE,
			dbo.ahf_ANSI2Unicode(@NAME_AM),
			@NAME_EN,
			dbo.ahf_ANSI2Unicode(@DESCRIPTION_AM),
			@DESCRIPTION_EN
		)
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		declare @ErrorMessage nvarchar(4000) = ERROR_MESSAGE()
		RAISERROR (@ErrorMessage, 17, 1)
		RETURN
	END CATCH
GO
