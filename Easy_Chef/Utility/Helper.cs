using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Easy_Chef.Utility
{
    public class Helper
    {
        public static string GenerateOrderNumber()
        {
            var result = "1111111111";
            Random rand = new Random(DateTime.Now.Millisecond);
            result = rand.Next().ToString();
            return result;
        }
    }
}
