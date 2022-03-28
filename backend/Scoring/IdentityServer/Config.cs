using System.Collections.Generic;
using IdentityServer4;
using IdentityServer4.Configuration;
using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;

namespace IntelART.IdentityServer
{
    public class Config
    {
        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("customerApi", "Custiomer-specific API"),
                new ApiResource("loanApplicationApi", "API for creating and submitting loan appications"),
                new ApiResource("bankInternalApi", "Internal API to be used by the bank employees and systems"),
                new ApiResource("ecosystemOnBoarding", "ecosystemOnBoarding"),
            };
        }

        public static IEnumerable<Client> GetClients(IConfigurationSection config)
        {
            string customerApplicationUrl = config.GetSection("CustomerApplication")["Url"];
            string ecosystemOnBoarding = config.GetSection("EcosystemOnBoarding")["Url"];
            string bankApplicationUrl = config.GetSection("BankApplication")["Url"];
            string shopApplicationUrl = config.GetSection("ShopApplication")["Url"];
            string oidcEndpoint = "/signin-oidc";
            string customerOidcEndpoint = string.Format("{0}{1}", customerApplicationUrl, oidcEndpoint);
            string ecosystemOnBoardingOidcEndpoint = string.Format("{0}{1}", ecosystemOnBoarding, oidcEndpoint);
            string bankOidcEndpoint = string.Format("{0}{1}", bankApplicationUrl, oidcEndpoint);
            string shopOidcEndpoint = string.Format("{0}{1}", shopApplicationUrl, oidcEndpoint);
            return new List<Client>
            {
                new Client
                {
                    ClientId = "ecosystemOnBoarding",
                    ClientName = "ecosystemOnBoarding comment",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
                    AllowAccessTokensViaBrowser = true,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { ecosystemOnBoardingOidcEndpoint },
                    PostLogoutRedirectUris = { ecosystemOnBoardingOidcEndpoint },
                    AllowedCorsOrigins = { ecosystemOnBoarding },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "ecosystemOnBoarding"
                    },

                    RequireConsent = false,
                    AllowOfflineAccess = true,
                },

                new Client
                {
                    ClientId = "customerApplication",
                    ClientName = "Online application to be used by the custiomer",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
                    AllowAccessTokensViaBrowser = true,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { customerOidcEndpoint },
                    PostLogoutRedirectUris = { customerOidcEndpoint },
                    AllowedCorsOrigins = { customerApplicationUrl },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "loanApplicationApi",
                        "customerApi",
                    },

                    RequireConsent = false,
                    AllowOfflineAccess = true,
                },

                new Client
                {
                    ClientId = "customerApplication2",
                    ClientName = "Online application to be used by the custiomer",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,
                    AllowAccessTokensViaBrowser = true,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { customerOidcEndpoint },
                    PostLogoutRedirectUris = { customerOidcEndpoint },
                    AllowedCorsOrigins = { customerApplicationUrl },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "loanApplicationApi",
                        "customerApi",
                    },

                    RequireConsent = false,
                    AllowOfflineAccess = true,
                },

                new Client
                {
                    ClientId = "shopApplication",
                    ClientName = "Online application to be used at shops",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,
                    AllowAccessTokensViaBrowser = true,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { shopOidcEndpoint },
                    PostLogoutRedirectUris = { shopOidcEndpoint },
                    AllowedCorsOrigins = { shopApplicationUrl },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "loanApplicationApi",
                    },

                    RequireConsent = false,
                    AllowOfflineAccess = true,
                },

                new Client
                {
                    ClientId = "shopApplication2",
                    ClientName = "Online application to be used at shops",
                    AllowedGrantTypes = GrantTypes.ResourceOwnerPasswordAndClientCredentials,
                    AllowAccessTokensViaBrowser = true,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { shopOidcEndpoint },
                    PostLogoutRedirectUris = { shopOidcEndpoint },
                    AllowedCorsOrigins = { shopApplicationUrl },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "loanApplicationApi",
                    },

                    RequireConsent = false,
                    AllowOfflineAccess = true,
                },

                new Client
                {
                    ClientId = "bankApplication",
                    ClientName = "Online application to be used at bank",
                    AllowedGrantTypes = GrantTypes.HybridAndClientCredentials,
                    ////AllowAccessTokensViaBrowser = true,

                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },

                    RedirectUris = { bankOidcEndpoint },
                    PostLogoutRedirectUris = { bankOidcEndpoint },
                    AllowedCorsOrigins = { bankApplicationUrl },

                    AllowedScopes =
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "bankInternalApi",
                    },

                    RequireConsent = false,
                    AllowOfflineAccess = true,
                }
            };
        }


        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
                {
                    new IdentityResources.OpenId(),
                    new IdentityResources.Profile(),
                };
        }

        public static void SetupIdentityServer(IdentityServerOptions options)
        {
            options.UserInteraction.LoginUrl = "/Authentication/Login";
            options.UserInteraction.LogoutUrl = "/Authentication/Logout";
        }
    }
}
