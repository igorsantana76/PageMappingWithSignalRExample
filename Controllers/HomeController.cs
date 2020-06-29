using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PageMappingWithSignalRExample.Models;

namespace PageMappingWithSignalRExample.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;

        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult ExamplePage1()
        {
            return View();
        }

        public IActionResult ExamplePage2()
        {
            return View();
        }

        public IActionResult ExamplePage3()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        [Route("api/track/listall")]
        public IEnumerable<TrackRecord> ListAll()
        {
            return MockDB.TrackRecords.ToList();
        }
    }
}
