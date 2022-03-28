CREATE OR ALTER FUNCTION f_GetReportDate(@PERIOD	varchar(20))
RETURNS date
AS
BEGIN
	declare @Result date = null
	set @PERIOD=rtrim(@PERIOD)
	declare @Year char(4) = substring(@PERIOD,4,4)
	declare @Month tinyint
	if left(@PERIOD,2)='00'
	begin
		set @Month=13
	end
	else if left(@PERIOD,1)='2'
	begin
		set @Month = 3 * convert(tinyint,substring(@PERIOD,2,1)) + 1
	end
	else if left(@PERIOD,2) between '01' and '12'
	begin
		set @Month = convert(tinyint,left(@PERIOD,2)) + 1
	end
	if @month=13
		set @Result = @Year + '-12-31'
	else
		set @Result = DATEADD(day, -1, @Year + '-' + convert(varchar,@Month) + '-01')
	RETURN @Result
END
GO
