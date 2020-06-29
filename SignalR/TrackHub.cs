using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using PageMappingWithSignalRExample.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace PageMappingWithSignalRExample.SignalR
{
    public class TrackHub : Hub
    {
        public static ConcurrentDictionary<string, UserTrackInfo> ConnectedUsers = new ConcurrentDictionary<string, UserTrackInfo>();

        public UserTrackInfo CurrentUser { get { return ConnectedUsers.Values.FirstOrDefault(a => a.ConnectionId == Context.ConnectionId); } }

        private static int _id = 0;

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            RegisterDisconnectFromPage();
            await base.OnDisconnectedAsync(exception);
        }

        [HubMethodName("RegisterPageAccess")]
        public void RegisterPageAccess(string id, string pageUrl)
        {
            var user = new UserTrackInfo { ConnectionId = Context.ConnectionId, CurrentPageUrl = pageUrl, Id = id };

            ConnectedUsers.TryAdd(Context.ConnectionId, user);
        }

        [HubMethodName("RegisterDisconnectFromPage")]
        public void RegisterDisconnectFromPage()
        {
            if (CurrentUser == null)
                return;

            var url = CurrentUser.CurrentPageUrl;

            var dateTimeNow = DateTime.Now;
            var timeSpanDiff = (dateTimeNow - CurrentUser.InitialAccessTime);
            var passedSeconds = timeSpanDiff.TotalSeconds;

            var entitySplit = url.Split('/').Where(a => a != "").ToList();
            var entityName = entitySplit.FirstOrDefault() ?? "";

            if (!string.IsNullOrWhiteSpace(entityName) && entityName.Contains("?"))
                entityName = entityName.Split('?').FirstOrDefault(a => a != "");

            // you can add a rule for accepting only 1sec or more of access time
            var trackRecord = new TrackRecord()
            {
                Id = ++_id,
                UserId = CurrentUser.Id,
                RelativeUrl = url,
                EntityName = entityName,
                PassedSeconds = passedSeconds,
                BeginAccessDateTime = CurrentUser.InitialAccessTime,
                EndAccessDateTime = dateTimeNow
            };

            MockDB.TrackRecords.Add(trackRecord);

            ConnectedUsers.TryRemove(Context.ConnectionId, out UserTrackInfo discard);
        }
    }

    public class UserTrackInfo : ICloneable
    {
        public string Id { get; set; } = "";

        public string ConnectionId { get; set; }

        public string CurrentPageUrl { get; set; } = "";

        public DateTime InitialAccessTime { get; private set; } = DateTime.Now;

        public object Clone()
        {
            return this.MemberwiseClone();
        }
    }
}
