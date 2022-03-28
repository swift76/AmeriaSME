if exists (select * from sys.objects where name='sp_LogClientIpAddress' and type='P')
	drop procedure dbo.sp_LogClientIpAddress
GO

create procedure dbo.sp_LogClientIpAddress(@IP_ADDRESS		varchar(20),
											@USER_ID		int,
											@OPERATION_TYPE	varchar(30))
AS
	insert into dbo.IP_ADDRESS_LOG (IP_ADDRESS, USER_ID, OPERATION_TYPE)
		values (@IP_ADDRESS, @USER_ID, @OPERATION_TYPE)
GO
