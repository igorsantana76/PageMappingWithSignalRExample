using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PageMappingWithSignalRExample.Models
{
    public class MockDB
    {
        public static ConcurrentBag<TrackRecord> TrackRecords { get; set; } = new ConcurrentBag<TrackRecord>();
    }
}
