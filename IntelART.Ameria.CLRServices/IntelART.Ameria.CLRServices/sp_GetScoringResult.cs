using System;
using System.Data;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
using IntelART.Ameria.CLRServices;
using System.Net;
using System.IO;

public partial class StoredProcedures
{
    [SqlProcedure]
    public static void sp_GetScoringResult(SqlInt32 queryTimeout, SqlString id)
    {
        using (DataHelper helper = new DataHelper())
        {
            try
            {
                ServiceConfig config = helper.GetServiceConfig("SCOR");
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(string.Format("{0}?id={1}", config.URL, id));
                request.ContentType = "application/x-www-form-urlencoded";
                request.Timeout = 1000 * queryTimeout.Value;
                request.ReadWriteTimeout = request.Timeout;
                request.Method = "GET";
                SqlMoney result;
                WebResponse response = request.GetResponse();
                using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                {
                    string responseText = reader.ReadToEnd();
                    result = decimal.Parse(responseText.Replace("[", "").Replace("]", "").Replace("{", "").Replace("}", "").Replace("\"", "").Split(':')[1]);
                }
                helper.SaveScoringResult(new Guid(id.ToString()), result.Value);
            }
            catch (Exception ex)
            {
                helper.LogError("Scoring Query", ex.ToString());
                throw new ApplicationException(ex.Message);
            }
        }
    }
};
