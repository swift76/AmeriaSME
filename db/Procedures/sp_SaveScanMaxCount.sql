if exists (select * from sys.objects where name='sp_SaveScanMaxCount' and type='P')
	drop procedure sp_SaveScanMaxCount
GO

create procedure sp_SaveScanMaxCount(@CODE	char(1),
									 @VALUE	tinyint)
AS
	declare @DESCRIPTION nvarchar(150) =
		case @CODE
			when 'T' then N'Հարկային հաշվետվությունների առավելագույն քանակ'
			when 'B' then N'Բիզնեսի գործունեության վայրի լուսանկարների առավելագույն քանակ'
			when 'L' then N'Բիզնեսի գործունեության վայրի վարձակալության պայմանագրերի առավելագույն քանակ'
			when 'C' then N'Գրավի սեփականության վկայականների առավելագույն քանակ'
			when 'A' then N'Գնահատման հաշվետվությունների առավելագույն քանակ'
			when 'P' then N'Գրավադրվող գույքի սեփականատերերի անձնագրերի առավելագույն քանակ'
			when 'M' then N'Գրավադրվող գույքի սեփականատերերի ամուսնության վկայականների առավելագույն քանակ'
			when 'R' then N'Գրավադրվող գույքի սահմանափակումների վերաբերյալ կադաստրի միասնական տեղեկանքների առավելագույն քանակ'
			when 'O' then N'Այլ փաստաթղթերի առավելագույն քանակ'
		end
	insert into SCAN_MAX_COUNT (CODE,VALUE,DESCRIPTION)
		values (@CODE,convert(char(2),@VALUE),@DESCRIPTION)
GO
