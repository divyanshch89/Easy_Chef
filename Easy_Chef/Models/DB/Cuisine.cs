using System;
using System.Collections.Generic;

namespace Easy_Chef.Models.DB
{
    public partial class Cuisine
    {
        public Cuisine()
        {
            Recipe = new HashSet<Recipe>();
        }

        public int CuisineId { get; set; }
        public string CuisineName { get; set; }

        public ICollection<Recipe> Recipe { get; set; }
    }
}
