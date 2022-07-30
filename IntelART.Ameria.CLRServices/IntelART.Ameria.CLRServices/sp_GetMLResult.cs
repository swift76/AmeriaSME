using System;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
using IntelART.Ameria.CLRServices;
using System.Net;
using System.IO;

public partial class StoredProcedures
{
    [SqlProcedure]
    public static void sp_GetMLResult(SqlInt32 queryTimeout
        , SqlString id
        , SqlMoney amountNonRefinancing
        , SqlMoney amountRefinancing
        , SqlString loanUsageCode
        , SqlByte age
        , SqlMoney unsecuredRemainderOtherBanks
        , SqlMoney monthlyRepayment
        , SqlMoney inTurn
        , SqlMoney outTurn)
    {
        using (DataHelper helper = new DataHelper())
        {
            try
            {
                ServiceConfig config = helper.GetServiceConfig("MLPY");
                string loanUsageName = helper.GetLoanUsageName(loanUsageCode.Value);
                string url = $"{config.URL}?id={id}&contract_amount={amountNonRefinancing.Value}&contract_amount_ref={amountRefinancing.Value}&sector={loanUsageName}&age={age.Value}&unsecured_in_other_banks={unsecuredRemainderOtherBanks.Value}&ongoing_monthly_payments={monthlyRepayment.Value}&turnover_inflow={inTurn.Value}&turnover_outflow={outTurn.Value}";
                url = Uri.EscapeUriString(url);
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
                request.ContentType = "application/x-www-form-urlencoded";
                request.Timeout = 1000 * queryTimeout.Value;
                request.ReadWriteTimeout = request.Timeout;
                request.Method = "GET";
                string responseText;
                WebResponse response = request.GetResponse();
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    responseText = reader.ReadToEnd();
                }
                helper.SaveMLResult(new Guid(id.ToString()), responseText);
            }
            catch (Exception ex)
            {
                helper.LogError("Scoring Query", ex.ToString());
                throw new ApplicationException(ex.Message);
            }
        }
    }
};
