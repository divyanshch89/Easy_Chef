using System;
using System.Collections.Generic;

namespace Easy_Chef.Models.DB
{
    public partial class Role
    {
        public Role()
        {
            User = new HashSet<User>();
        }

        public int RoleId { get; set; }
        public string RoleName { get; set; }

        public ICollection<User> User { get; set; }
    }
}
