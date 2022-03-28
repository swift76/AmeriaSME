if (not exists (select * from sys.types where name='ApplicationCompanyOverhead'))
	CREATE TYPE ApplicationCompanyOverhead AS TABLE
	(
		INDUSTRY_CODE			char(4)				NOT NULL,
		INDUSTRY_PRODUCT_CODE	char(2)				NOT NULL,
		NET_AMOUNT				money				NOT NULL,
		SALE_AMOUNT				money				NOT NULL,
		PRODUCT_PERCENTAGE		money				NOT NULL
	)
GO
