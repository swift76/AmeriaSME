if exists (select * from sys.objects where name='ECOSYSTEM_USER' and type='U')
	drop table [ECOSYSTEM_USER]
GO

CREATE TABLE [dbo].[ECOSYSTEM_USER](
	[APPLICATION_USER_ID] [int] NOT NULL,
	[FIRST_NAME_EN] [varchar](50) NOT NULL,
	[LAST_NAME_EN] [varchar](50) NOT NULL,
 CONSTRAINT [PK_ECOSYSTEM_USER] PRIMARY KEY CLUSTERED 
(
	[APPLICATION_USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO