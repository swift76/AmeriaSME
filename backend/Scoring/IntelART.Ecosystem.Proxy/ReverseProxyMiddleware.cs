using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Policy;
using System.Threading.Tasks;

namespace IntelART.Ecosystem.Proxy
{
    public class ReverseProxyMiddleware
    {
        private HttpClient _httpClient;
        private readonly RequestDelegate _nextMiddleware;
        private Dictionary<string, string> _servicies;
        public ReverseProxyMiddleware(RequestDelegate nextMiddleware, Dictionary<string, string> servicies)
        {
            _nextMiddleware = nextMiddleware;
            _servicies = servicies;
        }

        public async Task Invoke(HttpContext context)
        {
            _httpClient = new HttpClient();
            string sericeHeader = "";
            if (context.Request.Headers.TryGetValue("service_name", out var traceValue))
            {
                sericeHeader = traceValue;
            }

            if (string.IsNullOrWhiteSpace(sericeHeader))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("service name is empty");
            }

            if (!_servicies.ContainsKey(sericeHeader))
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("incorrect service name");
            }

            if (sericeHeader == "identity")
            {
                Uri baseUrl = new Uri(_servicies[sericeHeader]);
                Uri tokenUrl = new Uri(baseUrl, "/connect/token");

                HttpResponseMessage responseMessage = await GetToken(tokenUrl, context);

                context.Response.StatusCode = (int)responseMessage.StatusCode;
                CopyFromTargetResponseHeaders(context, responseMessage);
                await responseMessage.Content.CopyToAsync(context.Response.Body);

                return;
            }

            var targetUri = BuildTargetUri(context.Request, _servicies[sericeHeader]);

            if (targetUri != null)
            {
                string authorization = "";
                if (context.Request.Headers.TryGetValue("Authorization", out var authorizationValue))
                {
                    authorization = authorizationValue;
                    authorization = authorization.Trim();
                }
                if (!string.IsNullOrWhiteSpace(authorization))
                {
                    _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authorization);
                    context.Request.Headers.Remove("Authorization");
                }


                foreach (var header in context.Request.Headers)
                {
                    _httpClient.DefaultRequestHeaders.TryAddWithoutValidation(header.Key, header.Value.ToString());
                }

                var targetRequestMessage = CreateTargetMessage(context, targetUri);
                using (var responseMessage = await _httpClient.SendAsync(targetRequestMessage, HttpCompletionOption.ResponseHeadersRead, context.RequestAborted))
                {
                    context.Response.StatusCode = (int)responseMessage.StatusCode;
                    CopyFromTargetResponseHeaders(context, responseMessage);
                    await responseMessage.Content.CopyToAsync(context.Response.Body);
                }
                return;
            }
            await _nextMiddleware(context);
        }

        private class User
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        private async Task<HttpResponseMessage> GetToken(Uri url, HttpContext context)
        {
            string body = "";
            using (StreamReader stream = new StreamReader(context.Request.Body))
            {
                body = stream.ReadToEnd();
            }

            User user = JsonConvert.DeserializeObject<User>(body);

            var keyValues = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("username", user.Username),
                new KeyValuePair<string, string>("password",user.Password),
                new KeyValuePair<string, string>("client_id", "ecosystemOnBoarding"),
                new KeyValuePair<string, string>("client_secret", "secret"),
                new KeyValuePair<string, string>("scope", "ecosystemOnBoarding"),
                new KeyValuePair<string, string>("grant_type", "password")
            };

            var request = new HttpRequestMessage(HttpMethod.Post, url);

            request.Content = new FormUrlEncodedContent(keyValues);

            var client = new HttpClient();

            return  await client.SendAsync(request);
        }

        private HttpRequestMessage CreateTargetMessage(HttpContext context, Uri targetUri)
        {
            var requestMessage = new HttpRequestMessage();
            CopyFromOriginalRequestContentAndHeaders(context, requestMessage);

            requestMessage.RequestUri = targetUri;
            requestMessage.Headers.Host = targetUri.Host;
            requestMessage.Method = GetMethod(context.Request.Method);

            return requestMessage;
        }

        private void CopyFromOriginalRequestContentAndHeaders(HttpContext context, HttpRequestMessage requestMessage)
        {
            var requestMethod = context.Request.Method;

            if (!HttpMethods.IsGet(requestMethod) &&
              !HttpMethods.IsHead(requestMethod) &&
              !HttpMethods.IsDelete(requestMethod) &&
              !HttpMethods.IsTrace(requestMethod))
            {
                var streamContent = new StreamContent(context.Request.Body);
                requestMessage.Content = streamContent;
            }

            foreach (var header in context.Request.Headers)
            {
                requestMessage.Content?.Headers.TryAddWithoutValidation(header.Key, header.Value.ToString());
                //requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToString());
            }
        }

        private void CopyFromTargetResponseHeaders(HttpContext context, HttpResponseMessage responseMessage)
        {
            foreach (var header in responseMessage.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }

            foreach (var header in responseMessage.Content.Headers)
            {
                context.Response.Headers[header.Key] = header.Value.ToArray();
            }
            context.Response.Headers.Remove("transfer-encoding");
        }
        private static HttpMethod GetMethod(string method)
        {
            if (HttpMethods.IsDelete(method)) return HttpMethod.Delete;
            if (HttpMethods.IsGet(method)) return HttpMethod.Get;
            if (HttpMethods.IsHead(method)) return HttpMethod.Head;
            if (HttpMethods.IsOptions(method)) return HttpMethod.Options;
            if (HttpMethods.IsPost(method)) return HttpMethod.Post;
            if (HttpMethods.IsPut(method)) return HttpMethod.Put;
            if (HttpMethods.IsTrace(method)) return HttpMethod.Trace;
            return new HttpMethod(method);
        }

        private Uri BuildTargetUri(HttpRequest request, string endpoint)
        {
            Uri targetUri = new Uri(endpoint + request.Path + request.QueryString);

            return targetUri;
        }
    }
}