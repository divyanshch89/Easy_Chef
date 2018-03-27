using System;
using System.Collections.Generic;

namespace Easy_Chef.Models.DB
{
    public partial class Recipe
    {
        public int RecipeId { get; set; }
        public string RecipeName { get; set; }
        public string PrepTime { get; set; }
        public string DifficultyLevel { get; set; }
        public string SpiceLevel { get; set; }
        public string Price { get; set; }
        public string IsVeg { get; set; }
        public string Image1 { get; set; }
        public string Image2 { get; set; }
        public string Image3 { get; set; }
        public string CookLimit { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public string NutritionValue { get; set; }
        public string BoxContent { get; set; }
        public string ChefName { get; set; }
        public int CuisineId { get; set; }

        public Cuisine Cuisine { get; set; }
    }
}
