using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.IO;
using System.Xml;

namespace IntelART.Ameria.CLRServices
{
    public class ServiceHelper
    {
        public static int QueryTimeout { get; set; }

        public static string GetNodeValue(XmlNode document, string nodePath, bool decorated = true)
        {
            string result = string.Empty;
            XmlNode node = document.SelectSingleNode(nodePath);
            if (node != null)
            {
                if (decorated)
                    result = RetrieveValue(node.InnerXml);
                else
                    result = node.InnerXml.Trim();
            }
            return result;
        }

        public static DateTime GetNORQDateValue(string dateString, DateTime defaultValue)
        {
            DateTime result;
            try
            {
                result = new DateTime(int.Parse(dateString.Substring(0, 4)), int.Parse(dateString.Substring(5, 2)), int.Parse(dateString.Substring(8, 2)));
            }
            catch
            {
                result = defaultValue;
            }
            return result;
        }

        public static DateTime? GetNullableNORQDateValue(string dateString)
        {
            DateTime? result;
            try
            {
                result = new DateTime(int.Parse(dateString.Substring(0, 4)), int.Parse(dateString.Substring(5, 2)), int.Parse(dateString.Substring(8, 2)));
            }
            catch
            {
                result = null;
            }
            return result;
        }

        public static string GetFormattedXML(string sourceXML)
        {
            string result = sourceXML;
            using (MemoryStream stream = new MemoryStream())
            using (XmlTextWriter writer = new XmlTextWriter(stream, Encoding.Unicode))
            {
                try
                {
                    XmlDocument document = new XmlDocument();
                    document.LoadXml(sourceXML);
                    writer.Formatting = Formatting.Indented;
                    document.WriteContentTo(writer);
                    writer.Flush();
                    stream.Flush();
                    stream.Position = 0;
                    using (StreamReader reader = new StreamReader(stream))
                        result = reader.ReadToEnd();
                }
                catch (XmlException)
                {
                }
            }
            return result;
        }

        public static string GenerateUniqueID(byte length)
        {
            string randomNumber = (new Random()).Next().ToString();
            if (randomNumber.Length > length)
                randomNumber = randomNumber.Substring(0, length);
            else if (randomNumber.Length < length)
                randomNumber = randomNumber.PadLeft(length, '0');
            return randomNumber;
        }

        public static string DecorateValue(string value)
        {
            return string.Format("<![CDATA[{0}]]>", value);
        }

        public static string RetrieveValue(XmlNode node)
        {
            if (node == null)
            {
                return "";
            }
            return RetrieveValue(node.InnerXml);
        }

        public static string RetrieveValue(string value)
        {
            string output = value.Replace("<![CDATA[", string.Empty).Replace("]]>", string.Empty).Trim();
            output = output.Replace("<", "'");
            output = output.Replace(">", "'");
            return output;
        }

        public static decimal RetrieveOptionalAmount(XmlNode node, string nodeName)
        {
            decimal amount = 0;
            XmlNode foundNode = node.SelectSingleNode(nodeName);
            if (foundNode != null)
                decimal.TryParse(RetrieveValue(foundNode.InnerXml), out amount);
            return amount;
        }

        public static int RetrieveOptionalCount(XmlNode node, string nodeName)
        {
            int count = 0;
            XmlNode foundNode = node.SelectSingleNode(nodeName);
            if (foundNode != null)
                int.TryParse(RetrieveValue(foundNode.InnerXml), out count);
            return count;
        }

        public static XmlDocument CheckACRAResponse(string responseText)
        {
            XmlDocument document = new XmlDocument();
            document.LoadXml(responseText);
            string responseCode = GetNodeValue(document, "/ROWDATA[@*]/Response");
            if (responseCode.ToUpper() != "OK")
                throw new ApplicationException(GetNodeValue(document, "/ROWDATA[@*]/Error"));
            return document;
        }

        public static XmlDocument GetServiceResult(string url
            , string action
            , int queryTimeout
            , string method
            , Dictionary<string, string> parameters
            , string requestNode = null
            , string requestNamespace = null
            , Dictionary<string, string> parentParameters = null)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentType = "text/xml; charset=utf-8";
            request.Timeout = 1000 * queryTimeout;
            request.ReadWriteTimeout = request.Timeout;
            request.Method = "POST";
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;
            request.Headers.Add("SOAPAction", action);
            using (StreamWriter writer = new StreamWriter(request.GetRequestStream()))
            {
                writer.Write(GenerateSOAPBody(method, parameters, requestNode, requestNamespace, parentParameters));
            }
            WebResponse response = request.GetResponse();
            XmlDocument document = new XmlDocument();
            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
            {
                document.LoadXml(reader.ReadToEnd());
            }
            return document;
        }

        public static string DecodeResponseXML(string source)
        {
            return source.Replace("&lt;", "<").Replace("&gt;", ">")
                .Replace("&amp;", "&")
                .Replace("&quot;", @"""")
                .Replace("&apos;", "'");
        }

        public static ACRALoginResult ACRALogin(ServiceConfig config, int queryTimeout, string serviceType)
        {
            ACRALoginResult result = new ACRALoginResult();
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add("ReqID", GenerateUniqueID(13));
            parameters.Add("User", config.UserName);
            parameters.Add("Password", config.UserPassword);
            parameters.Add("service_type", serviceType);
            XmlDocument document = GetServiceResult(config.URL, "http://tempuri.org/IsrvACRA/f_AcraLogin", queryTimeout, "f_AcraLogin", parameters);
            result.Error = GetNodeValue(document, "/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_AcraLoginResponse']/*[local-name()='f_AcraLoginResult']/*[local-name()='Error']");
            result.SID = GetNodeValue(document, "/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_AcraLoginResponse']/*[local-name()='f_AcraLoginResult']/*[local-name()='SID']");
            result.Response = GetNodeValue(document, "/*[local-name()='Envelope']/*[local-name()='Body']/*[local-name()='f_AcraLoginResponse']/*[local-name()='f_AcraLoginResult']/*[local-name()='Response']");
            return result;
        }

        private static string GenerateSOAPBody(string method
            , Dictionary<string, string> parameters
            , string requestNode = null
            , string requestNamespace = null
            , Dictionary<string, string> parentParameters = null)
        {
            StringBuilder builder = new StringBuilder();
            builder.Append(@"<s:Envelope xmlns:s=""http://schemas.xmlsoap.org/soap/envelope/"">");
            builder.Append(@"<s:Body>");
            builder.AppendFormat(@"<{0} xmlns=""http://tempuri.org/"">", method);
            if (!string.IsNullOrEmpty(requestNode))
            {
                builder.AppendFormat(@"<{0} xmlns:a=""{1}"" xmlns:i=""http://www.w3.org/2001/XMLSchema-instance"">", requestNode, requestNamespace);
            }
            foreach (string parameter in parameters.Keys)
            {
                builder.AppendFormat(@"<{2}{0}>{1}</{2}{0}>", parameter, parameters[parameter], string.IsNullOrEmpty(requestNamespace) ? string.Empty : "a:");
            }
            if (!string.IsNullOrEmpty(requestNode))
            {
                builder.AppendFormat(@"</{0}>", requestNode);
            }
            if (parentParameters != null && parentParameters.Count > 0)
            {
                foreach (string parameter in parentParameters.Keys)
                {
                    builder.AppendFormat(@"<{0}>{1}</{0}>", parameter, parentParameters[parameter]);
                }
            }
            builder.AppendFormat(@"</{0}>", method);
            builder.Append(@"</s:Body>");
            builder.Append(@"</s:Envelope>");
            return builder.ToString();
        }

        public static DateTime GetACRADateValue(string dateString, DateTime? defaultValue = null)
        {
            if (string.IsNullOrEmpty(dateString) || dateString == "00-00-0000")
                return defaultValue.Value;
            return new DateTime(int.Parse(dateString.Substring(6, 4)), int.Parse(dateString.Substring(3, 2)), int.Parse(dateString.Substring(0, 2)));
        }

        public static DateTime? GetACRANullableDateValue(string dateString)
        {
            if (string.IsNullOrEmpty(dateString) || dateString == "00-00-0000")
                return null;
            return GetACRADateValue(dateString);
        }

        public static string GetDateTimeString()
        {
            return DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
        }

        public static string GetERegisterResponseText(string url, string method, string partnerKey, Dictionary<string, string> parameters, int serviceTimeout)
        {
            string responseText;
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Headers.Add("SOAPAction", string.Format("http://tempuri.org/IERegister/{0}", method));
            request.ContentType = "text/xml; charset=utf-8";
            request.Timeout = serviceTimeout;
            request.ReadWriteTimeout = request.Timeout;
            byte[] bytes = Encoding.UTF8.GetBytes(PrepareERegisterRequestXML(method, partnerKey, parameters));
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            using (Stream stream = request.GetRequestStream())
                stream.Write(bytes, 0, bytes.Length);
            WebResponse response = request.GetResponse();
            using (StreamReader reader = new StreamReader(response.GetResponseStream()))
                responseText = reader.ReadToEnd();

            responseText = responseText.Replace("xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\"", string.Empty);
            responseText = responseText.Replace("xmlns=\"http://tempuri.org/\"", string.Empty);
            responseText = responseText.Replace("xmlns:a=\"http://schemas.datacontract.org/2004/07/ERegister.DataContract\"", string.Empty);
            responseText = responseText.Replace("xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\"", string.Empty);
            responseText = responseText.Replace("xmlns=\"http://norq.am/dxchange/2013\"", string.Empty);
            responseText = responseText.Replace("xmlns:b=\"http://schemas.microsoft.com/2003/10/Serialization/Arrays\"", string.Empty);
            responseText = responseText.Replace("xsi:nil=\"true\"", string.Empty);
            responseText = responseText.Replace("s:", string.Empty);
            responseText = responseText.Replace("a:", string.Empty);
            responseText = responseText.Replace("i:", string.Empty);
            responseText = responseText.Replace("b:", string.Empty);
            
            return responseText;
        }

        public static string PrepareERegisterRequestXML(string method, string partnerKey, Dictionary<string, string> parameters)
        {
            StringBuilder builder = new StringBuilder("<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">");
            builder.Append("<s:Body>");
            builder.AppendFormat("<{0} xmlns=\"http://tempuri.org/\">", method);
            builder.AppendFormat("<partner_key>{0}</partner_key>", partnerKey);
            builder.Append("<Request xmlns:a=\"http://schemas.datacontract.org/2004/07/ERegister.DataContract\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">");
            builder.Append("<a:id>1</a:id>");
            builder.Append("<a:params>");
            foreach (string key in parameters.Keys)
                builder.AppendFormat("<a:{0}>{1}</a:{0}>", key, parameters[key]);
            builder.Append("</a:params>");
            builder.Append("</Request>");
            builder.AppendFormat("</{0}>", method);
            builder.Append("</s:Body>");
            builder.Append("</s:Envelope>");
            return builder.ToString();
        }

        public static XmlDocument GetERegisterResponseDocument(string parameterName, string parameterValue, ServiceConfig config, int serviceTimeout)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            parameters.Add(parameterName, parameterValue);
            string responseText = GetERegisterResponseText(config.URL, "CompanyInfo", config.UserPassword, parameters, serviceTimeout);
            XmlDocument document = new XmlDocument();
            document.LoadXml(responseText);
            return document;
        }

        public static ACRALoginResult DoACRALogin(ServiceConfig config)
        {
            ACRALoginResult loginResult = ACRALogin(config, 180, "acra_monitoring");
            if (loginResult.Response != "OK")
                throw new ApplicationException(loginResult.Error);
            return loginResult;
        }
    }
}
