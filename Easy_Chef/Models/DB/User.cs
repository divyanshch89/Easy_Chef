using System;
using System.Collections.Generic;

namespace Easy_Chef.Models.DB
{
    public partial class User
    {
        public int UserId { get; set; }
        public string UserFname { get; set; }
        public string UserLname { get; set; }
        public string UserEmail { get; set; }
        public string UserAddress { get; set; }
        public int RoleId { get; set; }
        public int? PaymentId { get; set; }
        public string UserFbId { get; set; }

        public Payment Payment { get; set; }
        public Role Role { get; set; }
    }
}
