var friends_url = "http://twitter.com/statuses/friends.json";
var statusbox = $("#status");
var message = {
    action : friends_url,
    method : "GET",
    parameters : {}
};
var accessor = {
    consumerKey:    'ruXg6gDIBxihEyMd9jCHdQ',
    consumerSecret: '5SLxFQ0WrXPfOC11dbIq8ASihJvecHEvHK4YvLuQq4',
    token: '',
    tokenSecret: '',
};

chrome.extension.sendRequest('', function(response) {
    accessor.token       = response[0];
    accessor.tokenSecret = response[1];
    OAuth.completeRequest(message, accessor);
    OAuth.SignatureMethod.sign(message, accessor);
    friends_url = friends_url + '?' + OAuth.formEncode(message.parameters);

    if ( accessor.token ) {
        var data;
        $.getJSON(friends_url, function(json) {
            data = $.map(json, function(n,i) {
               return "@" + n.screen_name;
            });
            statusbox.autocomplete(
                data.sort(
                    function(a,b){return a.toLowerCase()>b.toLowerCase()?1:-1; }
                )
            );
        });
    }
});

// XXX todo:
    // 1. all friends, not just 100
    // 2. animating "working" plugin icon
    // 3. figure out auth stuff
    // 4. new icon
