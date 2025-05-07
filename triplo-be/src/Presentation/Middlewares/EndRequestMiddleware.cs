﻿using log4net;
using System.Diagnostics;
using System.Text.Json;

namespace src.Presentation.Middlewares
{
    public class EndRequestMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILog log;

        public EndRequestMiddleware(RequestDelegate next, ILog log)
        {
            this.next = next;
            this.log = log;
        }

        public async Task Invoke(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            try
            {
                await next(context);
            }
            catch (Exception e)
            {
                log.Error($"Request failed error: {e.ToString()}");
                context.Response.Clear();

                var errorMessage = new { message = "Something went wrong with server" };
                var jsonErrorMessage = JsonSerializer.Serialize(errorMessage);
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(jsonErrorMessage);
                context.Response.StatusCode = 500;
            }
            finally
            {
                stopwatch.Stop();
                log.Info($"Response: Status Code: {context.Response?.StatusCode}, Latency: {stopwatch.ElapsedMilliseconds} ms");
            }
        }
    }
}
