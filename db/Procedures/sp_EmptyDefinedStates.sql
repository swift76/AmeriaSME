if exists (select * from sys.objects where name='sp_EmptyDefinedStates' and type='P')
	drop procedure sp_EmptyDefinedStates
GO

create procedure sp_EmptyDefinedStates
AS
	delete from APPLICATION_STATUS where ID between 150 and 199
GO
