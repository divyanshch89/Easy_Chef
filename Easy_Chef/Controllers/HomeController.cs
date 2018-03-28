using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Easy_Chef.Models;
using Easy_Chef.Models.DB;

namespace Easy_Chef.Controllers
{
    public class HomeController : Controller
    {
        //private readonly DB_A383F2_easychefContext _context;
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Menu()
        {
            return View();
        }
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Cart()
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
    }
}
