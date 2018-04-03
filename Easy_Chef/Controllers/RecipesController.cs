using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Easy_Chef.Models.DB;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Easy_Chef.Controllers
{
    public class RecipesController : Controller
    {
        private readonly DB_A383F2_easychefContext _context;
        public RecipesController(DB_A383F2_easychefContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index(int id)
        {
            if (id == 0)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe.Include(r => r.Cuisine).SingleOrDefaultAsync(m => m.RecipeId == id);
            if (recipe == null)
            {
                return NotFound();
            }
            //ViewData["CuisineId"] = new SelectList(_context.Cuisine, "CuisineId", "CuisineName", recipe.CuisineId);
            return View(recipe);
            //ViewBag.Message = id;
            // return View();
        }
    }
}