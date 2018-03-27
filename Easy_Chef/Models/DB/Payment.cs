using System;
using System.Collections.Generic;

namespace Easy_Chef.Models.DB
{
    public partial class Payment
    {
        public Payment()
        {
            User = new HashSet<User>();
        }

        public int PaymentId { get; set; }
        public string Type { get; set; }
        public string CardNumber { get; set; }
        public string ExpirationDate { get; set; }

        public ICollection<User> User { get; set; }
    }
}
