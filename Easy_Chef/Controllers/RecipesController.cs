using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Easy_Chef.Controllers
{
    public class RecipesController : Controller
    {
        public IActionResult Index(int id)
        {
            ViewBag.Message = id;
            return View();
        }
    }
}