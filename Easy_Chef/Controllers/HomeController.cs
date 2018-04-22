using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Easy_Chef.Models;
using Easy_Chef.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace Easy_Chef.Controllers
{
    public class HomeController : Controller
    {
        private readonly DB_A383F2_easychefContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public HomeController(DB_A383F2_easychefContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Menu()
        {
            var dB_A383F2_easychefContext = _context.Recipe.Include(r => r.Cuisine);
            return View(dB_A383F2_easychefContext.ToList());
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Cart()
        {
            return View();
        }

        public IActionResult Checkout()
        {
            var model = new User();
            if (IsAuthenticationCookieExist())
            {
                var cookieData = JObject.Parse(_httpContextAccessor.HttpContext.Request.Cookies["authentication"]).ToObject<User>(); ;
                if (cookieData.UserId > 0)
                {
                    model = _context.User.SingleOrDefault(u => u.UserId == cookieData.UserId);
                }
            }
            return View(model);
        }
        public IActionResult OrderReview()
        {
            return View();
        }
        public IActionResult Payment()
        {
            return View();
        }
        public IActionResult OrderComplete()
        {
            return View();
        }

        public IActionResult CheckOutType()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }
        public IActionResult NotAuthorize()
        {

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        private bool IsAuthenticationCookieExist()
        {
            return _httpContextAccessor.HttpContext.Request.Cookies["authentication"] != null;
        }
    }
}
