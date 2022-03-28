using System;
using System.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Windows.Forms;
using Dapper;

namespace BankProcessingSimulator
{
    public partial class MainForm : Form
    {
        string ConnectionString;

        public MainForm()
        {
            InitializeComponent();
            ConnectionString = ConfigurationManager.ConnectionStrings["ScoringDB"].ConnectionString;
        }

        private void buttonClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void buttonApprove_Click(object sender, EventArgs e)
        {
            SetStatus(8);
        }

        private void buttonRefuse_Click(object sender, EventArgs e)
        {
            SetStatus(9);
        }

        private void SetStatus(int status)
        {
            using (IDbConnection connection = new SqlConnection(ConnectionString))
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();

                int statusId;
                switch (status)
                {
                    case 24:
                        statusId = 18;
                        break;
                    case 20:
                        statusId = 20;
                        break;
                    case 35:
                        statusId = 31;
                        break;
                    case -9:
                        statusId = 31;
                        status = 9;
                        break;
                    default:
                        statusId = 1;
                        break;
                }

                int isn = (new Random()).Next();

                IEnumerable<Guid> ids = connection.Query<Guid>("select ID from APPLICATION where STATUS_ID=" + statusId, commandType: CommandType.Text);
                foreach (Guid id in ids)
                {
                    switch (status)
                    {
                        case 8:
                            if (checkIsCompanyLLC.Checked)
                            {
                                connection.Execute("insert into dbo.EREGISTER_QUERY_RESULT (APPLICATION_ID, TYPE) values ('" + id.ToString() + "', N'ՍՊԸ')", commandType: CommandType.Text);
                                connection.Execute("insert into dbo.EREGISTER_QUERY_RESULT_OWNER (APPLICATION_ID, IS_FOUNDER) values ('" + id.ToString() + "', 1)", commandType: CommandType.Text);

                                if (checkHasMultipleOwners.Checked)
                                {
                                    connection.Execute("insert into dbo.EREGISTER_QUERY_RESULT_OWNER (APPLICATION_ID, IS_FOUNDER) values ('" + id.ToString() + "', 1)", commandType: CommandType.Text);
                                }
                            }
                            else
                            {
                                connection.Execute("insert into dbo.EREGISTER_QUERY_RESULT (APPLICATION_ID, TYPE) values ('" + id.ToString() + "', N'Ա/Ձ')", commandType: CommandType.Text);
                            }

                            if (checkHasIDCard.Checked)
                            {
                                connection.Execute("insert into dbo.NORQ_QUERY_RESULT (APPLICATION_ID, ID_CARD_NUMBER) values ('" + id.ToString() + "', '123456789')", commandType: CommandType.Text);
                            }
                            else
                            {
                                connection.Execute("insert into dbo.NORQ_QUERY_RESULT (APPLICATION_ID, ID_CARD_NUMBER) values ('" + id.ToString() + "', '')", commandType: CommandType.Text);
                            }

                            if (checkIsRefinancing.Checked)
                            {
                                if (checkOnlyRefinancing.Checked)
                                {
                                    connection.Execute("insert into APPLICATION_SCORING_RESULT (APPLICATION_ID, APPROVED_AMOUNT_2, REFINANCING_AMOUNT, INTEREST) values ('" + id.ToString() + "', 500000, 700000, 12)", commandType: CommandType.Text);
                                }
                                else
                                {
                                    connection.Execute("insert into APPLICATION_SCORING_RESULT (APPLICATION_ID, APPROVED_AMOUNT_1, APPROVED_AMOUNT_2, REFINANCING_AMOUNT, INTEREST) values ('" + id.ToString() + "', 300000, 500000, 700000, 12)", commandType: CommandType.Text);
                                }

                                connection.Execute("insert into dbo.REFINANCING_LOAN (APPLICATION_ID, ROW_ID, ORIGINAL_BANK_NAME, LOAN_TYPE, INITIAL_INTEREST, CURRENCY, INITIAL_AMOUNT, CURRENT_BALANCE, DRAWDOWN_DATE, MATURITY_DATE) values ('"
                                    + id.ToString() + "', 1, N'Կոնվերս Բանկ', N'Սպառողական', 18, 'AMD', 300000, 250000, '2010-04-07', '2020-04-07')", commandType: CommandType.Text);
                                connection.Execute("insert into dbo.REFINANCING_LOAN (APPLICATION_ID, ROW_ID, ORIGINAL_BANK_NAME, LOAN_TYPE, INITIAL_INTEREST, CURRENCY, INITIAL_AMOUNT, CURRENT_BALANCE, DRAWDOWN_DATE, MATURITY_DATE) values ('"
                                    + id.ToString() + "', 2, N'ՀայԷկոնոմ Բանկ', N'Օվերդրաֆտ', 16, 'USD', 150000, 100000, '2015-12-20', '2022-12-20')", commandType: CommandType.Text);
                                connection.Execute("insert into dbo.REFINANCING_LOAN (APPLICATION_ID, ROW_ID, ORIGINAL_BANK_NAME, LOAN_TYPE, INITIAL_INTEREST, CURRENCY, INITIAL_AMOUNT, CURRENT_BALANCE, DRAWDOWN_DATE, MATURITY_DATE) values ('"
                                    + id.ToString() + "', 3, N'Հայբիզնես Բանկ', N'Օվերդրաֆտ', 21, 'EUR', 100000, 18000, '2017-03-03', '2022-03-03')", commandType: CommandType.Text);
                            }
                            else
                            {
                                connection.Execute("insert into APPLICATION_SCORING_RESULT (APPLICATION_ID, APPROVED_AMOUNT_1,INTEREST) values ('" + id.ToString() + "', 300000,16)", commandType: CommandType.Text);
                            }
                            connection.Execute("update APPLICATION set STATUS_ID=8,CLIENT_CODE='" + textClientCode.Text + "',ISN=" + isn.ToString() + " where ID='" + id.ToString() + "'", commandType: CommandType.Text);

                            break;
                        case 9:
                            connection.Execute("update APPLICATION set REFUSAL_REASON=N'Անբավարար միջոցներ',STATUS_ID=9,ISN=" + isn.ToString() + " where ID='" + id.ToString() + "'", commandType: CommandType.Text);
                            break;
                        case 7:
                            connection.Execute("insert into APPLICATION_SCORING_RESULT (APPLICATION_ID, INTEREST) values ('" + id.ToString() + "', 16)", commandType: CommandType.Text);
                            connection.Execute("update APPLICATION set MANUAL_REASON=N'Վերստուգման կարիք կա',STATUS_ID=10,ISN=" + isn.ToString() + " where ID='" + id.ToString() + "'", commandType: CommandType.Text);
                            break;
                        case 13:
                            connection.Execute("update APPLICATION set STATUS_ID=10,IS_CORPORATE=1,ISN=" + isn.ToString() + " where ID='" + id.ToString() + "'", commandType: CommandType.Text);
                            break;
                        case 24:
                            connection.Execute("update APPLICATION set STATUS_ID=24 where ID='" + id.ToString() + "'", commandType: CommandType.Text);
                            break;
                        case 20:
                            connection.Execute("execute dbo.sp_ChangeApplicationStatus '" + id.ToString() + "', 21", commandType: CommandType.Text);
                            connection.Execute("insert into MESSAGE (APPLICATION_ID, SCAN_TYPE, TEXT, FROM_BANK, IS_APPROVED) values ('" + id.ToString() + "', 'T', N'Ջնջեք նախորդ բոլոր հարկային հաշվետվությունները', 1, 0)", commandType: CommandType.Text);
                            connection.Execute("insert into MESSAGE (APPLICATION_ID, SCAN_TYPE, TEXT, FROM_BANK, IS_APPROVED) values ('" + id.ToString() + "', 'T', N'Կցեք հարկային նոր հաշվետվություն մարտ ամսվա համար', 1, 0)", commandType: CommandType.Text);
                            connection.Execute("insert into MESSAGE (APPLICATION_ID, SCAN_TYPE, TEXT, FROM_BANK, IS_APPROVED) values ('" + id.ToString() + "', 'T', N'Կցեք հարկային նոր հաշվետվություն հունիս ամսվա համար', 1, 0)", commandType: CommandType.Text);
                            connection.Execute("insert into MESSAGE (APPLICATION_ID, SCAN_TYPE, TEXT, FROM_BANK, IS_APPROVED) values ('" + id.ToString() + "', 'C', N'Կցեք գրավի սեփականության նոր վկայական', 1, 0)", commandType: CommandType.Text);
                            connection.Execute("insert into MESSAGE (APPLICATION_ID, SCAN_TYPE, TEXT, FROM_BANK, IS_APPROVED) values ('" + id.ToString() + "', 'B', N'Կցեք բիզնեսի գործունեության վայրի լուսանկար', 1, 0)", commandType: CommandType.Text);
                            break;
                        case 35:
                            connection.Execute("insert into APPLICATION_PREAPPROVED_RESULT (APPLICATION_ID, ID, IS_REFINANCING, APPROVED_AMOUNT, INTEREST, LOAN_TERM, REQUIRED_REAL_ESTATE, REQUIRED_MOVABLE_ESTATE, MONTHLY_PAYMENT_AMOUNT) values ('" + id.ToString() + "', 1, 0, 5000000, 12, 12, 0, 0, 10000)", commandType: CommandType.Text);
                            connection.Execute("insert into APPLICATION_PREAPPROVED_RESULT (APPLICATION_ID, ID, IS_REFINANCING, APPROVED_AMOUNT, INTEREST, LOAN_TERM, REQUIRED_REAL_ESTATE, REQUIRED_MOVABLE_ESTATE, MONTHLY_PAYMENT_AMOUNT) values ('" + id.ToString() + "', 2, 1, 7000000, 12, 12, 0, 0, 14000)", commandType: CommandType.Text);
                            connection.Execute("insert into APPLICATION_PREAPPROVED_RESULT (APPLICATION_ID, ID, IS_REFINANCING, APPROVED_AMOUNT, INTEREST, LOAN_TERM, REQUIRED_REAL_ESTATE, REQUIRED_MOVABLE_ESTATE, MONTHLY_PAYMENT_AMOUNT) values ('" + id.ToString() + "', 3, 0, 15000000, 14, 36, 5000000, 7000000, 10000)", commandType: CommandType.Text);
                            connection.Execute("insert into APPLICATION_PREAPPROVED_RESULT (APPLICATION_ID, ID, IS_REFINANCING, APPROVED_AMOUNT, INTEREST, LOAN_TERM, REQUIRED_REAL_ESTATE, REQUIRED_MOVABLE_ESTATE, MONTHLY_PAYMENT_AMOUNT) values ('" + id.ToString() + "', 4, 1, 17000000, 14, 36, 3000000, 5000000, 12000)", commandType: CommandType.Text);
                            connection.Execute("insert into APPLICATION_PREAPPROVED_RESULT (APPLICATION_ID, ID, IS_REFINANCING, APPROVED_AMOUNT, INTEREST, LOAN_TERM, REQUIRED_REAL_ESTATE, REQUIRED_MOVABLE_ESTATE, MONTHLY_PAYMENT_AMOUNT) values ('" + id.ToString() + "', 5, 0, 25000000, 12, 60, 15000000, 17000000, 10000)", commandType: CommandType.Text);
                            connection.Execute("insert into APPLICATION_PREAPPROVED_RESULT (APPLICATION_ID, ID, IS_REFINANCING, APPROVED_AMOUNT, INTEREST, LOAN_TERM, REQUIRED_REAL_ESTATE, REQUIRED_MOVABLE_ESTATE, MONTHLY_PAYMENT_AMOUNT) values ('" + id.ToString() + "', 6, 1, 27000000, 12, 60, 13000000, 15000000, 10000)", commandType: CommandType.Text);

                            connection.Execute("update APPLICATION set STATUS_ID=35 where ID='" + id.ToString() + "'", commandType: CommandType.Text);
                            break;
                    }
                }
            }
        }

        private void buttonManual_Click(object sender, EventArgs e)
        {
            SetStatus(7);
        }

        private void buttonGive_Click(object sender, EventArgs e)
        {
            SetStatus(24);
        }

        private void buttonCorporate_Click(object sender, EventArgs e)
        {
            SetStatus(13);
        }

        private void checkIsCompanyLLC_CheckedChanged(object sender, EventArgs e)
        {
            if (!checkIsCompanyLLC.Checked)
                checkHasMultipleOwners.Checked = false;
        }

        private void checkHasMultipleOwners_CheckedChanged(object sender, EventArgs e)
        {
            if (!checkIsCompanyLLC.Checked)
                checkHasMultipleOwners.Checked = false;
        }

        private void checkOnlyRefinancing_CheckedChanged(object sender, EventArgs e)
        {
            if (!checkIsRefinancing.Checked)
                checkOnlyRefinancing.Checked = false;
        }

        private void checkIsRefinancing_CheckedChanged(object sender, EventArgs e)
        {
            if (!checkIsRefinancing.Checked)
                checkOnlyRefinancing.Checked = false;
        }

        private void buttonMessage_Click(object sender, EventArgs e)
        {
            SetStatus(20);
        }

        private void buttonLSApprove_Click(object sender, EventArgs e)
        {
            SetStatus(35);
        }

        private void buttonLSRefuse_Click(object sender, EventArgs e)
        {
            SetStatus(-9);
        }
    }
}
