using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PageMappingWithSignalRExample.Models
{
    public class TrackRecord
    {
        public string UserId { get; internal set; }
        public string RelativeUrl { get; internal set; }
        public string EntityName { get; internal set; }
        public double PassedSeconds { get; internal set; }
        public DateTime BeginAccessDateTime { get; internal set; }
        public DateTime EndAccessDateTime { get; internal set; }
        public int Id { get; internal set; }
    }
}
