using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using IntelART.OnlineLoans.Entities;
using IntelART.OnlineLoans.Repositories;

namespace IntelART.OnlineLoans.LoanApplicationRestApi.Controllers
{
    /// <summary>
    /// Controller class to implement the API methods required for viewing, creating, and
    /// managing loan applications
    /// </summary>
    [Authorize]
    [Route("/Applications/{id}/Photos")]
    public class LoanApplicationPhotosController : RepositoryControllerBase<ApplicationRepository>
    {
        public LoanApplicationPhotosController(IConfigurationRoot configuration)
            : base(configuration, (connectionString) => new ApplicationRepository(connectionString))
        {
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Photos
        /// </summary>
        [HttpGet]
        public async Task<IEnumerable<ApplicationPhoto>> Get(Guid id)
        {
            IEnumerable<ApplicationPhoto> applicationDocuments = this.Repository.GetApplicationPhotos(id);

            // Get back to UI only FileName without mimeType
            foreach (ApplicationPhoto photo in applicationDocuments)
            {
                if (photo.FILE_NAME != null)
                {
                    int splitIndex = photo.FILE_NAME.LastIndexOf('|');
                    if (splitIndex >= 0)
                    {
                        photo.FILE_NAME = photo.FILE_NAME.Substring(0, splitIndex);
                    }
                }
            }

            return applicationDocuments;
        }

        /// <summary>
        /// Implements GET /Applications/{id}/Photos/applicationId
        /// </summary>
        [HttpGet("{applicationId}")]
        public async Task<IActionResult> Get(int id, Guid applicationId)
        {
            IActionResult result;
            Stream stream;
            string mimeType = "application/octet-stream";
            string originalFileName = null;

            stream = null;
            IEnumerable<ApplicationPhoto> applicationDocuments = this.Repository.GetApplicationPhotos(applicationId);
            if (applicationDocuments != null)
            {
                foreach (ApplicationPhoto documentMetadata in applicationDocuments)
                {
                    if (documentMetadata.FILE_NAME != null)
                    {
                        int splitIndex = documentMetadata.FILE_NAME.LastIndexOf('|');
                        if (splitIndex >= 0)
                        {
                            originalFileName = documentMetadata.FILE_NAME.Substring(0, splitIndex);
                            mimeType = documentMetadata.FILE_NAME.Substring(splitIndex + 1);
                            byte[] content = this.Repository.GetApplicationPhotoContent(id);
                            if (content == null)
                            {
                                throw new ApplicationException("E-5002", string.Format("The contract file does not exist for the application {0}", id));
                            }
                            stream = new MemoryStream(content);
                            stream.Position = 0;
                        }
                    }
                    break;
                }
            }

            result = File(stream, mimeType, originalFileName);
            return result;
        }

        /// <summary>
        /// Implements PUT /Applications/{id}/Photos
        /// </summary>
        [HttpPut]
        public async Task<int> Put(Guid id, bool isPledge)
        {
            int idPhoto = 0;
            if (HttpContext.Request.HasFormContentType
                && HttpContext.Request.Form != null
                && HttpContext.Request.Form.Files != null)
            {
                foreach (IFormFile file in HttpContext.Request.Form.Files)
                {
                    string originalFileName = file.FileName;

                    try
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            file.OpenReadStream().CopyTo(ms);
                            idPhoto = this.Repository.SaveApplicationPhoto(id, string.Format("{0}|{1}", originalFileName, file.ContentType), isPledge, ms.ToArray());
                        }

                    }
                    catch (Exception ex)
                    {
                        throw new ApplicationException("E-0010", string.Format("Failed to save uploaded file {0}", originalFileName), ex);
                    }
                }
            }
            else
            {
                throw new ApplicationException("E-0310", string.Format("The request for saving photo for application {0} does not contain valid payload", id));
            }
            return idPhoto;
        }

        /// <summary>
        /// Implements DELETE /Applications/{id}/Photos
        /// </summary>
        [HttpDelete]
        public async Task Delete(int id)
        {
            this.Repository.DeleteApplicationPhoto(id);
        }
    }
}
