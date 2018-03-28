using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Easy_Chef.Models.DB;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Easy_Chef
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {//Scaffold-DbContext "Server=tcp:sql7004.site4now.net,1433;Database=DB_A383F2_easychef;User Id=DB_A383F2_easychef_admin;Password=@Qazwsx123@;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models/DB
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddDbContext<DB_A383F2_easychefContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DB_A383F2_easychefDatabase")));
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" }
                    );
                routes.MapRoute(
                    name: "Recipes",
                    template: "menu/{controller}/{id?}",
                    defaults: new { controller = "Recipes", action = "Index" }
                    );
                routes.MapRoute(
                   name: "Admin",
                   template: "admin/{controller}/{action}/{id?}",
                   defaults: new { controller = "Recipe", action = "Index" }
                   );
            });
        }
    }
}
