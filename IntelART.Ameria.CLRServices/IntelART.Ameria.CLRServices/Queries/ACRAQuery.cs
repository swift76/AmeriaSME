using System;
using System.Collections.Generic;
using System.Text;
using System.Transactions;
using System.Xml;

namespace IntelART.Ameria.CLRServices
{
    public class ACRAQuery
    {
        public void GetResponse(DataHelper dataAccess, ServiceConfig config, string sessionID, ACRAEntity entity)
        {
            dataAccess.SaveACRATryCount(entity.ID);
            ACRALegalQueryResult result = ParseLegalResponse(dataAccess, GetResponseText(dataAccess, config, sessionID, entity, entity.IsIE ? "03" : "02"), entity.ID);
            if (result != null)
            {
                ACRALegalQueryResult resultLegal;
                if (entity.IsIE)
                {
                    resultLegal = ParseLegalResponse(dataAccess, GetResponseText(dataAccess, config, sessionID, entity, "05"), entity.ID);
                    result.Details = resultLegal.Details;
                    result.Queries = resultLegal.Queries;
                    result.Interrelated = resultLegal.Interrelated;
                    result.Payments = resultLegal.Payments;
                    result.DueDates = resultLegal.DueDates;
                    result.AllPayments = resultLegal.AllPayments;
                    result.ClassificationCount = resultLegal.ClassificationCount;
                    result.ReviewDate = resultLegal.ReviewDate;
                    result.LoanWorstClass = resultLegal.LoanWorstClass;
                    result.GuaranteeWorstClass = resultLegal.GuaranteeWorstClass;
                }
                else
                {
                    resultLegal = new ACRALegalQueryResult();
                }
                using (TransactionScope transScope = new TransactionScope())
                {
                    if (dataAccess.LockApplicationByID(entity.ID, 5))
                    {
                        dataAccess.SaveACRAQueryResult(entity.ID, result, resultLegal);
                    }
                    transScope.Complete();
                }
            }
        }

        public void GetLegalResponse(DataHelper dataAccess, ServiceConfig config, string sessionID, ACRALegalEntity entity)
        {
            dataAccess.SaveACRALegalTryCount(entity.ID);
            string responseText = dataAccess.GetCachedACRALegalResponse(entity.TaxCode);
            if (string.IsNullOrEmpty(responseText))
            {
                bool isPreapproved = (entity.ImportID > 0);

                StringBuilder requestPerson = new StringBuilder();
                requestPerson.Append(@"<a:LegalParticipientRequest>");
                requestPerson.AppendFormat(@"<a:FirmName>{0}</a:FirmName>", entity.Name);
                requestPerson.Append(@"<a:KindBorrower>2</a:KindBorrower>");
                requestPerson.AppendFormat(@"<a:RequestTarget>{0}</a:RequestTarget>", isPreapproved ? "11" : "1");
                requestPerson.AppendFormat(@"<a:TaxID>{0}</a:TaxID>", entity.TaxCode);
                requestPerson.AppendFormat(@"<a:UsageRange>{0}</a:UsageRange>", isPreapproved ? "54" : "20");
                requestPerson.Append(@"<a:id>1</a:id>");
                requestPerson.Append(@"</a:LegalParticipientRequest>");

                Dictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add("AppNumber", ServiceHelper.GenerateUniqueID(15));
                parameters.Add("DateTime", DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
                parameters.Add("ReportType", "05");
                parameters.Add("ReqID", ServiceHelper.GenerateUniqueID(13));
                parameters.Add("SID", sessionID);
                parameters.Add("participient", requestPerson.ToString());
                Dictionary<string, string> parentParameters = new Dictionary<string, string>();
                parentParameters.Add("service_type", "acra_service");

                XmlDocument document = ServiceHelper.GetServiceResult(config.URL, "http://tempuri.org/IsrvACRA/f_AcraLegalLoanXML", dataAccess.GetServiceTimeout(2), "f_AcraLegalLoanXML", parameters, "legalrequest", "http://schemas.datacontract.org/2004/07/ACRA.business.legal", parentParameters);
                XmlNode node = document.SelectSingleNode("/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_AcraLegalLoanXMLResponse']/*[local-name()='f_AcraLegalLoanXMLResult']");
                if (node != null)
                {
                    responseText = ServiceHelper.DecodeResponseXML(node.InnerXml);
                }
            }

            ACRALegalQueryResult result = ParseLegalResponse(dataAccess, responseText, entity.ID);
            if (result != null)
            {
                using (TransactionScope transScope = new TransactionScope())
                {
                    if (dataAccess.LockApplicationByID(entity.ID, 3))
                    {
                        dataAccess.SaveACRALegalQueryResult(entity.ID, result);
                    }
                    transScope.Complete();
                }
            }
        }

        private static void ParseQuery(XmlDocument document, List<ACRAQueryResultQueries> queries)
        {
            XmlNodeList list = document.SelectNodes("/ROWDATA[@*]/PARTICIPIENT[@*]/Requests/Request");
            foreach (XmlNode node in list)
                queries.Add(new ACRAQueryResultQueries()
                {
                    DATE = ServiceHelper.GetACRADateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("DateTime").InnerXml)),
                    BANK_NAME = ServiceHelper.RetrieveValue(node.SelectSingleNode("BankName").InnerXml),
                    REASON = ServiceHelper.RetrieveValue(node.SelectSingleNode("Reason").InnerXml)
                });
        }

        private static void ParseLoanGuarantee(XmlDocument document, bool isGuarantee, int currentYear, int currentMonth
            , List<string> creditLineTypes, List<string> ignoredLoanTypes, ACRALegalQueryResult result)
        {
            string prefixLG = isGuarantee ? "Guarantee" : "Loan";
            XmlNodeList list = document.SelectNodes(string.Format("/ROWDATA[@*]/PARTICIPIENT[@*]/{0}s/{0}", prefixLG));
            foreach (XmlNode node in list)
            {
                DateTime dateFrom = ServiceHelper.GetACRADateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditStart").InnerXml), DateTime.MinValue);
                DateTime dateTo = ServiceHelper.GetACRADateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("CloseDate").InnerXml), DateTime.MaxValue);
                string type = ServiceHelper.RetrieveValue(node.SelectSingleNode("LiabilityKind").InnerXml);
                string cur = ServiceHelper.RetrieveValue(node.SelectSingleNode("Currency").InnerXml);
                string pledge = ServiceHelper.RetrieveValue(node.SelectSingleNode("PledgeSubject").InnerXml);
                string loanID = ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditID").InnerXml);

                bool isLine = creditLineTypes.Contains(type.Trim().ToUpper());
                bool isIgnored = ignoredLoanTypes.Contains(pledge.Trim().ToUpper());

                int dueDays1, dueDays2, dueDays3, dueDays4;
                int dueDaysM1 = 0, dueDaysM2 = 0, dueDaysM3 = 0;
                int dueDaysMaxY1, dueDaysMaxY2, dueDaysMaxY = 0;

                DateTime? dateLastPayment = ServiceHelper.GetACRANullableDateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode(string.Format("{0}LastPaymentDate", prefixLG)).InnerXml));

                bool isOutstanding = (node.SelectSingleNode("OutstandingDaysCount") != null);
                List<ACRAQueryResultDueDates> dueDates = new List<ACRAQueryResultDueDates>();
                dueDays1 = GetDueDaysByYear(node, loanID, currentYear, currentMonth, 1, dateLastPayment, dateTo, isOutstanding, ref dueDaysM1, ref dueDaysM2, ref dueDaysM3, ref dueDaysMaxY, ref dueDates);
                dueDaysMaxY1 = dueDaysMaxY;
                dueDays2 = dueDays1 + GetDueDaysByYear(node, loanID, currentYear, currentMonth, 2, dateLastPayment, dateTo, isOutstanding, ref dueDaysM1, ref dueDaysM2, ref dueDaysM3, ref dueDaysMaxY, ref dueDates);
                dueDaysMaxY2 = dueDaysMaxY1 + dueDaysMaxY;
                dueDays3 = dueDays2 + GetDueDaysByYear(node, loanID, currentYear, currentMonth, 3, dateLastPayment, dateTo, isOutstanding, ref dueDaysM1, ref dueDaysM2, ref dueDaysM3, ref dueDaysMaxY, ref dueDates);
                dueDays4 = dueDays3 + GetDueDaysByYear(node, loanID, currentYear, currentMonth, 4, dateLastPayment, dateTo, isOutstanding, ref dueDaysM1, ref dueDaysM2, ref dueDaysM3, ref dueDaysMaxY, ref dueDates);
                result.DueDates.AddRange(dueDates);

                if (node.SelectSingleNode("MonthlyPaymentAmount") != null)
                {
                    result.AllPayments.AddRange(FillAllPaymentAmounts(node, loanID, cur));
                    if (!isGuarantee && !isLine && !isIgnored && result.AllPayments.Count > 0)
                    {
                        foreach (ACRAQueryResultPayments payment in result.AllPayments)
                        {
                            int i;
                            for (i = 0; i < result.Payments.Count; i++)
                            {
                                if (result.Payments[i].CUR == payment.CUR && result.Payments[i].YEAR == payment.YEAR && result.Payments[i].MONTH == payment.MONTH)
                                {
                                    result.Payments[i].AMOUNT += payment.AMOUNT;
                                    break;
                                }
                            }
                            if (i == result.Payments.Count)
                            {
                                result.Payments.Add(new ACRAQueryResultPayments()
                                {
                                    CUR = payment.CUR,
                                    YEAR = payment.YEAR,
                                    MONTH = payment.MONTH,
                                    AMOUNT = payment.AMOUNT
                                });
                            }
                        }
                    }
                }

                result.Details.Add(new ACRAQueryResultDetails()
                {
                    STATUS = ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditStatus").InnerXml),
                    FROM_DATE = dateFrom,
                    TO_DATE = dateTo,
                    TYPE = type,
                    CUR = cur,
                    CONTRACT_AMOUNT = decimal.Parse(ServiceHelper.RetrieveValue(node.SelectSingleNode("Amount").InnerXml)),
                    DEBT = decimal.Parse(ServiceHelper.RetrieveValue(node.SelectSingleNode("Balance").InnerXml)),
                    PAST_DUE_DATE = ServiceHelper.GetACRANullableDateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("OutstandingDate").InnerXml)),
                    RISK = ServiceHelper.RetrieveValue(node.SelectSingleNode(string.Format("The{0}Class", prefixLG)).InnerXml),
                    CLASSIFICATION_DATE = ServiceHelper.GetACRANullableDateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("LastClassificationDate").InnerXml)),
                    INTEREST_RATE = decimal.Parse(ServiceHelper.RetrieveValue(node.SelectSingleNode("Interest").InnerXml)),
                    PLEDGE = pledge,
                    PLEDGE_AMOUNT = ServiceHelper.RetrieveValue(node.SelectSingleNode("CollateralAmount").InnerXml),
                    OUTSTANDING_AMOUNT = ServiceHelper.RetrieveOptionalAmount(node, "AmountOverdue"),
                    OUTSTANDING_PERCENT = ServiceHelper.RetrieveOptionalAmount(node, "OutstandingPercent"),
                    BANK_NAME = ServiceHelper.RetrieveValue(node.SelectSingleNode("SourceName").InnerXml).ToUpper(),
                    IS_GUARANTEE = isGuarantee,
                    DUE_DAYS_1 = dueDays1,
                    DUE_DAYS_2 = dueDays2,
                    DUE_DAYS_3 = dueDays3,
                    DUE_DAYS_4 = dueDays4,
                    DUE_DAYS_M1 = dueDaysM1,
                    DUE_DAYS_M2 = dueDaysM2,
                    DUE_DAYS_M3 = dueDaysM3,
                    IS_CREDIT_LINE = isLine,
                    IS_IGNORED_LOAN = isIgnored,
                    SCOPE = ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditScope").InnerXml).ToUpper(),
                    DUE_DAYS_MAX_Y1 = dueDaysMaxY1,
                    DUE_DAYS_MAX_Y2 = dueDaysMaxY2,
                    LOAN_ID = loanID,
                    CREDITING_DATE = ServiceHelper.GetACRANullableDateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditingDate").InnerXml)),
                    CREDIT_USE_PLACE = ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditUsePlace").InnerXml),
                    PLEDGE_NOTES = ServiceHelper.RetrieveValue(node.SelectSingleNode("CollateralNotes").InnerXml),
                    PLEDGE_CURRENCY = ServiceHelper.RetrieveValue(node.SelectSingleNode("CollateralCurrency").InnerXml),
                    LAST_PAYMENT_DATE = dateLastPayment,
                    OVERDUE_MAIN_AMOUNT = ServiceHelper.RetrieveOptionalAmount(node, "LoanTimed"),
                    OVERDUE_INTEREST_AMOUNT = ServiceHelper.RetrieveOptionalAmount(node, "LoanInterestTimed"),
                    PROLONGATION_COUNT = ServiceHelper.RetrieveOptionalCount(node, "ProlongationsNum"),
                    WORST_CLASS_Y1 = ServiceHelper.RetrieveValue(node.SelectSingleNode(string.Format("TheWorstClass{0}1-12", prefixLG)).InnerXml),
                    WORST_CLASS_Y2 = ServiceHelper.RetrieveValue(node.SelectSingleNode(string.Format("TheWorstClass{0}13-24", prefixLG)).InnerXml),
                    WORST_CLASS_Y3_Y5 = ServiceHelper.RetrieveValue(node.SelectSingleNode(string.Format("TheWorstClass{0}25-60", prefixLG)).InnerXml),
                    SUM_OVERDUE_DAYS_Y1_Y2 = ServiceHelper.RetrieveOptionalCount(node, "OverdueDays1-24"),
                    MAX_OVERDUE_DAYS_Y1_Y2 = ServiceHelper.RetrieveOptionalCount(node, "MaxOverdueDays1-24"),
                    SUM_OVERDUE_DAYS_Y1_Y5 = ServiceHelper.RetrieveOptionalCount(node, "OverdueDays1-60"),
                    MAX_OVERDUE_DAYS_Y1_Y5 = ServiceHelper.RetrieveOptionalCount(node, "MaxOverdueDays1-60"),
                    OVERDUE_DAYS = ServiceHelper.RetrieveOptionalCount(node, "OverdueDays"),
                    INCOMING_DATE = ServiceHelper.GetACRANullableDateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("IncomingDate").InnerXml)),
                    DELAYED_PAYMENT_COUNT = ServiceHelper.RetrieveOptionalCount(node, "DelayPaymentQuantity1-12"),
                    PROVISION_AMOUNT = ServiceHelper.RetrieveOptionalAmount(node, "CreditAmount")
                });
            }
        }

        private static void ParseInterrelated(XmlDocument document, List<ACRAQueryResultInterrelated> interrelated)
        {
            XmlNodeList list = document.SelectNodes("/ROWDATA[@*]/PARTICIPIENT[@*]/InterrelatedData/Interrelated/InterrelatedLoans/InterrelatedLoan");
            foreach (XmlNode node in list)
            {
                interrelated.Add(new ACRAQueryResultInterrelated()
                {
                    STATUS = ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditClassification").InnerXml),
                    FROM_DATE = ServiceHelper.GetACRADateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditStart").InnerXml), DateTime.MinValue),
                    TO_DATE = ServiceHelper.GetACRADateValue(ServiceHelper.RetrieveValue(node.SelectSingleNode("LastInstallment").InnerXml), DateTime.MaxValue),
                    CUR = ServiceHelper.RetrieveValue(node.SelectSingleNode("Currency").InnerXml),
                    RISK = ServiceHelper.RetrieveValue(node.SelectSingleNode("CreditClassification").InnerXml),
                    CONTRACT_AMOUNT = decimal.Parse(ServiceHelper.RetrieveValue(node.SelectSingleNode("ContractAmount").InnerXml)),
                    DUE_AMOUNT = ServiceHelper.RetrieveOptionalAmount(node, "AmountDue"),
                    OVERDUE_AMOUNT = ServiceHelper.RetrieveOptionalAmount(node, "AmountOverdue"),
                    OUTSTANDING_PERCENT = ServiceHelper.RetrieveOptionalAmount(node, "OutstandingPercent")
                });
            }
        }

        private static int GetDueDaysByYear(XmlNode node, string loanID, int currentYear, int currentMonth, int shift, DateTime? dateLastPayment, DateTime dateTo, bool isOutstanding
            , ref int dueDaysM1, ref int dueDaysM2, ref int dueDaysM3, ref int dueDaysMaxY, ref List<ACRAQueryResultDueDates> dueDates)
        {
            int result = 0;
            DateTime dateCurrent = new DateTime(currentYear, currentMonth, 1);
            DateTime dateM1 = dateCurrent.AddMonths(-1);
            DateTime dateM2 = dateCurrent.AddMonths(-2);
            DateTime dateM3 = dateCurrent.AddMonths(-3);
            dueDaysMaxY = 0;

            XmlNodeList listDueYear = node.SelectNodes("OutstandingDaysCount/Year[@*]");
            foreach (XmlNode nodeDueYear in listDueYear)
            {
                XmlAttributeCollection colYear = nodeDueYear.Attributes;
                foreach (XmlAttribute attrYear in colYear)
                {
                    if (attrYear.Name.ToLower() == "name")
                    {
                        short valueYear = short.Parse(attrYear.Value);
                        if ((valueYear == (currentYear - shift)) || (valueYear == (currentYear - shift + 1)))
                        {
                            XmlNodeList listDueMonth = nodeDueYear.SelectNodes("Month");
                            foreach (XmlNode nodeDueMonth in listDueMonth)
                            {
                                XmlAttributeCollection colMonth = nodeDueMonth.Attributes;
                                foreach (XmlAttribute attrMonth in colMonth)
                                {
                                    if (attrYear.Name.ToLower() == "name")
                                    {
                                        byte valueMonth = byte.Parse(attrMonth.Value);
                                        if (IsDateInYear(currentYear, currentMonth, shift, valueYear, valueMonth))
                                        {
                                            int days = 0;
                                            if (int.TryParse(ServiceHelper.RetrieveValue(nodeDueMonth.InnerXml), out days))
                                            {
                                                if (isOutstanding)
                                                {
                                                    result += days;
                                                    DateTime valueDate = new DateTime(valueYear, valueMonth, 1);
                                                    if (valueDate == dateM1)
                                                        dueDaysM1 += days;
                                                    if (valueDate == dateM2)
                                                        dueDaysM2 += days;
                                                    if (valueDate == dateM3)
                                                        dueDaysM3 += days;
                                                    if (days > dueDaysMaxY)
                                                        dueDaysMaxY = days;
                                                }
                                                dueDates.Add(new ACRAQueryResultDueDates()
                                                {
                                                    LOAN_ID = loanID,
                                                    YEAR = valueYear,
                                                    MONTH = valueMonth,
                                                    COUNT = days
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (isOutstanding && dateLastPayment.HasValue)
            {
                int overdueDays = (dateTo - dateLastPayment.Value).Days;
                if (overdueDays < 0)
                {
                    if (IsDateInYear(currentYear, currentMonth, shift, dateLastPayment.Value.Year, dateLastPayment.Value.Month))
                        result -= overdueDays;
                }
            }

            return result;
        }

        private static bool IsDateInYear(int currentYear, int currentMonth, int shift, int valueYear, int valueMonth)
        {
            return ((valueYear == (currentYear - shift) && valueMonth > currentMonth) || valueYear == (currentYear - shift + 1) && valueMonth <= currentMonth);
        }

        private string RemoveNamespaces(string xml)
        {
            while (xml.Contains("xmlns"))
            {
                int position1 = xml.IndexOf("xmlns");
                int position2 = xml.IndexOf(">", position1);
                xml = string.Format("{0}{1}", xml.Substring(0, position1 - 1), xml.Substring(position2));
            }
            return xml;
        }

        private decimal GetDecimalValue(string stringValue)
        {
            decimal result;
            decimal decimalValue;
            if (decimal.TryParse(stringValue, out decimalValue))
                result = decimalValue;
            else
                result = 0;
            return result;
        }

        private int GetIntValue(string stringValue)
        {
            int result;
            int intValue;
            if (int.TryParse(stringValue, out intValue))
                result = intValue;
            else
                result = 0;
            return result;
        }

        private TaxAddress ParseAddress(XmlNode node)
        {
            if (node == null)
                return new TaxAddress();
            return new TaxAddress()
            {
                Region = node.SelectSingleNode("Region").InnerXml,
                Community = node.SelectSingleNode("Community").InnerXml,
                Street = node.SelectSingleNode("Street").InnerXml,
                Building = node.SelectSingleNode("Building").InnerXml,
                Apartment = node.SelectSingleNode("Apartment").InnerXml
            };
        }

        private string GetResponseText(DataHelper dataAccess
            , ServiceConfig config
            , string sessionID
            , ACRAEntity entity
            , string reportType)
        {
            string responseText = dataAccess.GetCachedACRAResponse(entity.SocialCardNumber);
            if (string.IsNullOrEmpty(responseText))
            {
                bool isPreapproved = (entity.ImportID > 0);

                StringBuilder requestPerson = new StringBuilder();
                requestPerson.Append(@"<a:PersonParticipientRequest>");
                requestPerson.AppendFormat(@"<a:DateofBirth>{0}</a:DateofBirth>", entity.BirthDate.ToString("dd-MM-yyyy"));
                requestPerson.AppendFormat(@"<a:FirstName>{0}</a:FirstName>", entity.FirstName);
                requestPerson.AppendFormat(@"<a:IdCardNumber>{0}</a:IdCardNumber>", entity.IDCardNumber);
                requestPerson.Append(@"<a:KindBorrower>1</a:KindBorrower>");
                requestPerson.AppendFormat(@"<a:LastName>{0}</a:LastName>", entity.LastName);
                requestPerson.AppendFormat(@"<a:PassportNumber>{0}</a:PassportNumber>", entity.PassportNumber);
                requestPerson.AppendFormat(@"<a:RequestTarget>{0}</a:RequestTarget>", isPreapproved ? "11" : "1");
                requestPerson.AppendFormat(@"<a:SocCardNumber>{0}</a:SocCardNumber>", entity.SocialCardNumber);
                requestPerson.AppendFormat(@"<a:UsageRange>{0}</a:UsageRange>", isPreapproved ? "54" : "20");
                requestPerson.Append(@"<a:id>1</a:id>");
                requestPerson.Append(@"</a:PersonParticipientRequest>");

                Dictionary<string, string> parameters = new Dictionary<string, string>();
                parameters.Add("AppNumber", ServiceHelper.GenerateUniqueID(15));
                parameters.Add("DateTime", DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss"));
                parameters.Add("ReportType", reportType);
                parameters.Add("ReqID", ServiceHelper.GenerateUniqueID(13));
                parameters.Add("SID", sessionID);
                parameters.Add("participient", requestPerson.ToString());
                Dictionary<string, string> parentParameters = new Dictionary<string, string>();
                parentParameters.Add("service_type", "acra_service");

                XmlDocument document = ServiceHelper.GetServiceResult(config.URL, "http://tempuri.org/IsrvACRA/f_AcraPersonLoanXML", dataAccess.GetServiceTimeout(5), "f_AcraPersonLoanXML", parameters, "personrequest", "http://schemas.datacontract.org/2004/07/ACRA.business.person", parentParameters);
                XmlNode node = document.SelectSingleNode("/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_AcraPersonLoanXMLResponse']/*[local-name()='f_AcraPersonLoanXMLResult']");
                if (node != null)
                {
                    responseText = ServiceHelper.DecodeResponseXML(node.InnerXml);
                }
            }
            return responseText;
        }

        private ACRALegalQueryResult ParseLegalResponse(DataHelper dataAccess, string responseText, Guid id)
        {
            ACRALegalQueryResult result = null;
            XmlDocument document;
            if (responseText.Substring(0, 7).ToLower() != "<error>")
            {
                document = ServiceHelper.CheckACRAResponse(responseText);
                string presence = ServiceHelper.GetNodeValue(document, "/ROWDATA[@*]/PARTICIPIENT[@*]/ThePresenceData");
                if (presence == "2")
                {
                    dataAccess.AutomaticallyRefuseApplication(id, "Վարկային զեկույցը արգելափակված է");
                }
                else
                {
                    result = new ACRALegalQueryResult();
                    result.ResponseXml = responseText;
                    result.Presence = presence;
                    int classificationCount = 0;
                    int.TryParse(ServiceHelper.GetNodeValue(document, "/ROWDATA[@*]/PARTICIPIENT[@*]/SwitchisClassQuantity"), out classificationCount);
                    result.ClassificationCount = classificationCount;
                    result.ReviewDate = ServiceHelper.GetACRANullableDateValue(ServiceHelper.GetNodeValue(document, "/ROWDATA[@*]/PARTICIPIENT[@*]/InformationReviewDate"));
                    result.LoanWorstClass = ServiceHelper.GetNodeValue(document, "/ROWDATA[@*]/PARTICIPIENT[@*]/TheWorstClassLoan");
                    result.GuaranteeWorstClass = ServiceHelper.GetNodeValue(document, "/ROWDATA[@*]/PARTICIPIENT[@*]/TheWorsClassGuarantee");
                    result.FicoScore = ServiceHelper.GetNodeValue(document, "/ROWDATA[@*]/PARTICIPIENT[@*]/Score/FICOScore");
                    if (presence == "1")
                    {
                        DateTime dateCurrent = dataAccess.GetServerDate();
                        int currentYear = dateCurrent.Year;
                        int currentMonth = dateCurrent.Month;
                        List<string> creditLineTypes = dataAccess.GetCreditLineTypes();
                        List<string> ignoredLoanTypes = dataAccess.GetIgnoredLoanTypes();
                        ParseLoanGuarantee(document, false, currentYear, currentMonth, creditLineTypes, ignoredLoanTypes, result);
                        ParseLoanGuarantee(document, true, currentYear, currentMonth, creditLineTypes, ignoredLoanTypes, result);
                    }
                    ParseQuery(document, result.Queries);
                    ParseInterrelated(document, result.Interrelated);

                    result.TaxData = ParseTaxData(document);
                }
            }
            return result;
        }

        private TaxData ParseTaxData(XmlDocument document)
        {
            string taxXmlString;
            TaxData taxData = new TaxData();
            XmlNode node = document.SelectSingleNode("/ROWDATA[@*]/PARTICIPIENT[@*]/TaxServiceInfo");
            if (node != null)
            {
                taxXmlString = node.InnerXml;
                if (!string.IsNullOrEmpty(taxXmlString))
                {
                    taxXmlString = RemoveNamespaces(taxXmlString.Trim());
                    XmlDocument taxDocument = new XmlDocument();
                    bool existsTaxData;
                    try
                    {
                        taxDocument.LoadXml(taxXmlString);
                        existsTaxData = true;
                    }
                    catch
                    {
                        existsTaxData = false;
                    }
                    if (existsTaxData)
                    {
                        string errorCode = ServiceHelper.GetNodeValue(taxDocument, "/Response/errorCode");
                        if (errorCode == "00")
                        {
                            taxData.TaxType = ServiceHelper.GetNodeValue(taxDocument, "/Response/TaxType");
                            taxData.Status = ServiceHelper.GetNodeValue(taxDocument, "/Response/OrgStatus");
                            taxData.Type = ServiceHelper.GetNodeValue(taxDocument, "/Response/OrganizationType");

                            taxData.RegistrationAddress = ParseAddress(taxDocument.SelectSingleNode("/Response/OrgJurLocation"));
                            taxData.CurrentAddress = ParseAddress(taxDocument.SelectSingleNode("/Response/OrgInFactLocations"));

                            XmlNodeList nodesActivity = taxDocument.SelectNodes("/Response/OrgActivities");
                            foreach (XmlNode nodeActivity in nodesActivity)
                            {
                                taxData.Activities.Add(new TaxActivity()
                                {
                                    Type = nodeActivity.SelectSingleNode("OrgActivity").InnerXml,
                                    Proportion = GetDecimalValue(nodeActivity.SelectSingleNode("ActivityProportion").InnerXml)
                                });
                            }

                            XmlNodeList nodesDebt = taxDocument.SelectNodes("/Response/TaxDebts");
                            foreach (XmlNode nodeDebt in nodesDebt)
                            {
                                taxData.Debts.Add(new TaxDebt()
                                {
                                    Type = nodeDebt.SelectSingleNode("TaxDebtType").InnerXml,
                                    Period = nodeDebt.SelectSingleNode("TaxReportPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodeDebt.SelectSingleNode("ReportUpdateDate").InnerXml),
                                    Debt = GetDecimalValue(nodeDebt.SelectSingleNode("TaxDebt").InnerXml),
                                    Outstanding = GetDecimalValue(nodeDebt.SelectSingleNode("OutstandingTaxDebt").InnerXml),
                                    Fine = GetDecimalValue(nodeDebt.SelectSingleNode("TaxFinePenalty").InnerXml),
                                    Overpayment = GetDecimalValue(nodeDebt.SelectSingleNode("TaxOverpayment").InnerXml)
                                });
                            }

                            XmlNodeList nodesPayment = taxDocument.SelectNodes("/Response/TaxesPaid");
                            foreach (XmlNode nodePayment in nodesPayment)
                            {
                                taxData.Payments.Add(new TaxPayment()
                                {
                                    Type = nodePayment.SelectSingleNode("TaxPaidType").InnerXml,
                                    Period = nodePayment.SelectSingleNode("TaxPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodePayment.SelectSingleNode("UpdateDate").InnerXml),
                                    Amount = GetDecimalValue(nodePayment.SelectSingleNode("TaxesPaidSum").InnerXml)
                                });
                            }

                            XmlNodeList nodesEmployees = taxDocument.SelectNodes("/Response/EmployeesNumbers");
                            foreach (XmlNode nodeEmployee in nodesEmployees)
                            {
                                taxData.Employees.Add(new TaxEmployee()
                                {
                                    Number = GetIntValue(nodeEmployee.SelectSingleNode("EmployeesNumber").InnerXml),
                                    Period = nodeEmployee.SelectSingleNode("TaxPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodeEmployee.SelectSingleNode("UpdateDate").InnerXml)
                                });
                            }

                            XmlNodeList nodesSalaryFund = taxDocument.SelectNodes("/Response/OrgSalaryFund");
                            foreach (XmlNode nodeSalaryFund in nodesSalaryFund)
                            {
                                taxData.SalaryFunds.Add(new TaxSalaryFund()
                                {
                                    Period = nodeSalaryFund.SelectSingleNode("TaxPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodeSalaryFund.SelectSingleNode("UpdateDate").InnerXml),
                                    Amount = GetDecimalValue(nodeSalaryFund.SelectSingleNode("SalaryFund").InnerXml)
                                });
                            }

                            XmlNodeList nodesProfit = taxDocument.SelectNodes("/Response/TaxableProfit");
                            foreach (XmlNode nodeProfit in nodesProfit)
                            {
                                taxData.Profits.Add(new TaxProfit()
                                {
                                    Period = nodeProfit.SelectSingleNode("TaxPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodeProfit.SelectSingleNode("UpdateDate").InnerXml),
                                    Amount = GetDecimalValue(nodeProfit.SelectSingleNode("TaxableProfitAmount").InnerXml)
                                });
                            }

                            XmlNodeList nodesPurchase = taxDocument.SelectNodes("/Response/ProductsAndServicesPurchases");
                            foreach (XmlNode nodePurchase in nodesPurchase)
                            {
                                taxData.Purchases.Add(new TaxPurchase()
                                {
                                    Period = nodePurchase.SelectSingleNode("TaxPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodePurchase.SelectSingleNode("UpdateDate").InnerXml),
                                    Amount = GetDecimalValue(nodePurchase.SelectSingleNode("ProductsServicesPurchase").InnerXml)
                                });
                            }

                            XmlNodeList nodesSale = taxDocument.SelectNodes("/Response/SalesTurnover");
                            foreach (XmlNode nodeSale in nodesSale)
                            {
                                taxData.Sales.Add(new TaxSale()
                                {
                                    Type = nodeSale.SelectSingleNode("SalesTurnoverType").InnerXml,
                                    Period = nodeSale.SelectSingleNode("TaxReportPeriod").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodeSale.SelectSingleNode("UpdateDate").InnerXml),
                                    Amount = GetDecimalValue(nodeSale.SelectSingleNode("SalesTurnoverAmount").InnerXml)
                                });
                            }

                            XmlNodeList nodesReportCorrection = taxDocument.SelectNodes("/Response/DeclLastCorrection");
                            foreach (XmlNode nodeReportCorrection in nodesReportCorrection)
                            {
                                taxData.ReportCorrections.Add(new TaxReportCorrection()
                                {
                                    ReportName = nodeReportCorrection.SelectSingleNode("DeclName").InnerXml,
                                    FieldName = nodeReportCorrection.SelectSingleNode("CorrectField").InnerXml,
                                    UpdateDate = ServiceHelper.GetACRANullableDateValue(nodeReportCorrection.SelectSingleNode("LastCorrectDate").InnerXml),
                                    FieldValue = GetDecimalValue(nodeReportCorrection.SelectSingleNode("CorrectFieldValue").InnerXml)
                                });
                            }
                        }
                    }
                }
            }
            return taxData;
        }

        private static List<ACRAQueryResultPayments> FillAllPaymentAmounts(XmlNode node, string loanID, string currency)
        {
            List<ACRAQueryResultPayments> payments = new List<ACRAQueryResultPayments>();
            XmlNodeList listPaymentYear = node.SelectNodes("MonthlyPaymentAmount/Year[@*]");
            foreach (XmlNode nodePaymentYear in listPaymentYear)
            {
                XmlAttributeCollection colYear = nodePaymentYear.Attributes;
                foreach (XmlAttribute attrYear in colYear)
                {
                    if (attrYear.Name.ToLower() == "name")
                    {
                        short valueYear = short.Parse(attrYear.Value);
                        XmlNodeList listPaymentMonth = nodePaymentYear.SelectNodes("Month");
                        foreach (XmlNode nodePaymentMonth in listPaymentMonth)
                        {
                            XmlAttributeCollection colMonth = nodePaymentMonth.Attributes;
                            foreach (XmlAttribute attrMonth in colMonth)
                            {
                                if (attrYear.Name.ToLower() == "name")
                                {
                                    byte valueMonth = byte.Parse(attrMonth.Value);
                                    decimal amount = 0;
                                    if (decimal.TryParse(ServiceHelper.RetrieveValue(nodePaymentMonth.InnerXml), out amount))
                                    {
                                        payments.Add(new ACRAQueryResultPayments()
                                        {
                                            CUR = currency,
                                            YEAR = valueYear,
                                            MONTH = valueMonth,
                                            AMOUNT = amount,
                                            LOAN_ID = loanID
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return payments;
        }
    }
}
