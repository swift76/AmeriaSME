using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
using IntelART.Ameria.CLRServices;

public partial class StoredProcedures
{
    [SqlProcedure]
    public static void sp_ProcessScoringQueries(SqlInt32 queryTimeout)
    {
        DataHelper.CommandTimeoutInterval = queryTimeout.Value;
        ServiceHelper.QueryTimeout = queryTimeout.Value;
        using (DataHelper helper = new DataHelper())
        {
            DoNORQLegalQueries(helper, helper.GetApplicationsForNORQLegalRequest());
            DoERegisterQueries(helper, helper.GetApplicationsForERegisterRequest());
            DoACRALegalQueries(helper, helper.GetApplicationsForACRALegalRequest());
            DoNORQQueries(helper, helper.GetApplicationsForNORQRequest());
            DoACRAQueries(helper, helper.GetApplicationsForACRARequest());
        }
    }

    [SqlProcedure]
    public static void sp_ProcessScoringQueriesByID(SqlInt32 queryTimeout, SqlGuid id)
    {
        DataHelper.CommandTimeoutInterval = queryTimeout.Value;
        ServiceHelper.QueryTimeout = queryTimeout.Value;
        using (DataHelper helper = new DataHelper())
        {
            DoNORQLegalQueries(helper, helper.GetApplicationForNORQLegalRequestByID(id.Value));
            DoERegisterQueries(helper, helper.GetApplicationForERegisterRequestByID(id.Value));
            DoACRALegalQueries(helper, helper.GetApplicationForACRALegalRequestByID(id.Value));
            DoNORQQueries(helper, helper.GetApplicationForNORQRequestByID(id.Value));
            DoACRAQueries(helper, helper.GetApplicationForACRARequestByID(id.Value));
        }
    }

    [SqlProcedure]
    public static void sp_ProcessScoringQueriesByISN(SqlInt32 queryTimeout, SqlInt32 isn)
    {
        DataHelper.CommandTimeoutInterval = queryTimeout.Value;
        ServiceHelper.QueryTimeout = queryTimeout.Value;
        using (DataHelper helper = new DataHelper())
        {
            DoNORQLegalQueries(helper, helper.GetApplicationForNORQLegalRequestByISN(isn.Value));
            DoERegisterQueries(helper, helper.GetApplicationForERegisterRequestByISN(isn.Value));
            DoACRALegalQueries(helper, helper.GetApplicationForACRALegalRequestByISN(isn.Value));
            DoNORQQueries(helper, helper.GetApplicationForNORQRequestByISN(isn.Value));
            DoACRAQueries(helper, helper.GetApplicationForACRARequestByISN(isn.Value));
        }
    }

    [SqlProcedure]
    public static void sp_SaveERegisterResult(SqlInt32 queryTimeout, SqlString taxNumber, SqlString registrationCode)
    {
        DataHelper.CommandTimeoutInterval = queryTimeout.Value;
        ServiceHelper.QueryTimeout = queryTimeout.Value;
        using (DataHelper helper = new DataHelper())
        {
            ServiceConfig config = helper.GetServiceConfig("EREG");
            try
            {
                ERegisterQueryResult result = (new ERegisterQuery()).GetERegisterResult(helper, taxNumber.Value, registrationCode.Value, config);
                if (result != null)
                    helper.SaveERegisterClientQueryResult(result, taxNumber.Value);
            }
            catch (Exception ex)
            {
                helper.LogError("ERegister Query", ex.ToString());
            }
        }
    }

    private static void DoNORQQueries(DataHelper helper, List<NORQEntity> entities_NORQ)
    {
        try
        {
            ServiceConfig config = helper.GetServiceConfig("NORQ");
            if (entities_NORQ.Count > 0)
            {
                NORQQuery norqQuery = new NORQQuery();
                foreach (NORQEntity entity in entities_NORQ)
                {
                    try
                    {
                        norqQuery.GetResponse(helper, config, entity);
                    }
                    catch (Exception ex)
                    {
                        helper.LogError("NORQ Query", ex.ToString(), entity.ID);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            helper.LogError("NORQ Query", ex.ToString());
        }
    }

    private static void DoACRAQueries(DataHelper helper, List<ACRAEntity> entities_ACRA)
    {
        try
        {
            ServiceConfig config = helper.GetServiceConfig("ACRA");
            if (entities_ACRA.Count > 0)
            {
                ACRALoginResult loginResult = ServiceHelper.DoACRALogin(config);
                ACRAQuery acraQuery = new ACRAQuery();
                foreach (ACRAEntity entity in entities_ACRA)
                    try
                    {
                        acraQuery.GetResponse(helper, config, loginResult.SID, entity);
                    }
                    catch (Exception ex)
                    {
                        helper.LogError("ACRA Query", ex.ToString(), entity.ID);
                    }
            }
        }
        catch (Exception ex)
        {
            helper.LogError("ACRA Query", ex.ToString());
        }
    }

    private static void DoNORQLegalQueries(DataHelper helper, List<NORQLegalEntity> entities_NORQ)
    {
        try
        {
            ServiceConfig config = helper.GetServiceConfig("NORQ");
            if (entities_NORQ.Count > 0)
            {
                NORQQuery norqQuery = new NORQQuery();
                foreach (NORQLegalEntity entity in entities_NORQ)
                {
                    try
                    {
                        norqQuery.GetLegalResponse(helper, config, entity);
                    }
                    catch (Exception ex)
                    {
                        helper.LogError("Legal NORQ Query", ex.ToString(), entity.ID);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            helper.LogError("Legal NORQ Query", ex.ToString());
        }
    }

    private static void DoACRALegalQueries(DataHelper helper, List<ACRALegalEntity> entities_ACRA)
    {
        try
        {
            ServiceConfig config = helper.GetServiceConfig("ACRA");
            if (entities_ACRA.Count > 0)
            {
                ACRALoginResult loginResult = ServiceHelper.DoACRALogin(config);
                ACRAQuery acraQuery = new ACRAQuery();
                foreach (ACRALegalEntity entity in entities_ACRA)
                {
                    if (!entity.IsIE)
                    {
                        try
                        {
                            acraQuery.GetLegalResponse(helper, config, loginResult.SID, entity);
                        }
                        catch (Exception ex)
                        {
                            helper.LogError("Legal ACRA Query", ex.ToString(), entity.ID);
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            helper.LogError("Legal ACRA Query", ex.ToString());
        }
    }

    private static void DoERegisterQueries(DataHelper helper, List<ERegisterEntity> entities)
    {
        try
        {
            ServiceConfig config = helper.GetServiceConfig("EREG");
            if (entities.Count > 0)
            {
                ERegisterQuery query = new ERegisterQuery();
                foreach (ERegisterEntity entity in entities)
                    try
                    {
                        query.GetResponse(helper, entity, config);
                    }
                    catch (Exception ex)
                    {
                        helper.LogError("ERegister Query", ex.ToString(), entity.ID);
                    }
            }
        }
        catch (Exception ex)
        {
            helper.LogError("ERegister Query", ex.ToString());
        }
    }
};
