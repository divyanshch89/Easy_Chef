using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Easy_Chef.Models.DB;

namespace Easy_Chef.Controllers
{
    [Produces("application/json")]
    [Route("api/Users")]
    public class UsersController : Controller
    {
        private readonly DB_A383F2_easychefContext _context;

        public UsersController(DB_A383F2_easychefContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public IEnumerable<User> GetUser()
        {
            return _context.User;
        }

        // GET: api/Users/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetUser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.User.SingleOrDefaultAsync(m => m.UserId == id);

            if (user == null)
            {
                return Ok();
            }

            return Ok(user);
        }
        // GET: api/UsersByFBId/xxxxxxxxxxxxxxx

        [HttpGet("{fbId}")]
        public async Task<IActionResult> GetUserByEmail([FromRoute] string fbId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.User.Select(x => new { x.UserFbId, x.Role.RoleName, x.UserId, x.UserFname, x.UserLname, x.UserEmail, x.UserAddress, x.UserPhone, x.PaymentId, x.Payment }).SingleOrDefaultAsync(m => m.UserFbId == fbId);

            if (user == null)
            {
                return Ok();
            }

            return Ok(user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser([FromRoute] int id, [FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.UserId)
            {
                return BadRequest();
            }
            //_context.Entry(user.Payment).State = EntityState.Modified;
            //var paymentToUpdate = _context.Payment.SingleOrDefault(p => p.PaymentId == user.PaymentId);
            //if (paymentToUpdate != null)
            //   _context.Payment.Update(paymentToUpdate);
            _context.User.Update(user);
            //_context.Payment.Update(user.Payment);

            // _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { id = user.UserId });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.User.SingleOrDefaultAsync(m => m.UserId == id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.UserId == id);
        }
    }
}