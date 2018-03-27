using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Easy_Chef.Models.DB;

namespace Easy_Chef.Controllers
{
    public class RecipeController : Controller
    {
        private readonly DB_A383F2_easychefContext _context;

        public RecipeController(DB_A383F2_easychefContext context)
        {
            _context = context;
        }

        // GET: Recipe
        public async Task<IActionResult> Index()
        {
            var dB_A383F2_easychefContext = _context.Recipe.Include(r => r.Cuisine);
            return View(await dB_A383F2_easychefContext.ToListAsync());
        }

        // GET: Recipe/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe
                .Include(r => r.Cuisine)
                .SingleOrDefaultAsync(m => m.RecipeId == id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        // GET: Recipe/Create
        public IActionResult Create()
        {
            ViewData["CuisineId"] = new SelectList(_context.Cuisine, "CuisineId", "CuisineName");
            return View();
        }

        // POST: Recipe/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("RecipeId,RecipeName,PrepTime,DifficultyLevel,SpiceLevel,Price,IsVeg,Image1,Image2,Image3,CookLimit,ShortDescription,LongDescription,NutritionValue,BoxContent,ChefName,CuisineId")] Recipe recipe)
        {
            if (ModelState.IsValid)
            {
                _context.Add(recipe);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CuisineId"] = new SelectList(_context.Cuisine, "CuisineId", "CuisineName", recipe.CuisineId);
            return View(recipe);
        }

        // GET: Recipe/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe.SingleOrDefaultAsync(m => m.RecipeId == id);
            if (recipe == null)
            {
                return NotFound();
            }
            ViewData["CuisineId"] = new SelectList(_context.Cuisine, "CuisineId", "CuisineName", recipe.CuisineId);
            return View(recipe);
        }

        // POST: Recipe/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("RecipeId,RecipeName,PrepTime,DifficultyLevel,SpiceLevel,Price,IsVeg,Image1,Image2,Image3,CookLimit,ShortDescription,LongDescription,NutritionValue,BoxContent,ChefName,CuisineId")] Recipe recipe)
        {
            if (id != recipe.RecipeId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(recipe);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RecipeExists(recipe.RecipeId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CuisineId"] = new SelectList(_context.Cuisine, "CuisineId", "CuisineName", recipe.CuisineId);
            return View(recipe);
        }

        // GET: Recipe/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var recipe = await _context.Recipe
                .Include(r => r.Cuisine)
                .SingleOrDefaultAsync(m => m.RecipeId == id);
            if (recipe == null)
            {
                return NotFound();
            }

            return View(recipe);
        }

        // POST: Recipe/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var recipe = await _context.Recipe.SingleOrDefaultAsync(m => m.RecipeId == id);
            _context.Recipe.Remove(recipe);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RecipeExists(int id)
        {
            return _context.Recipe.Any(e => e.RecipeId == id);
        }
    }
}
