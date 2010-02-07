var statusbox     = $("#status");
var screen_name   = $("#me_name").text();
var friends_count = Number($("#following_count").text());
var num_pages     = Math.ceil(friends_count / 100);
var friends_url   = "http://twitter.com/statuses/friends.json";
var friends_list  = [];

// oauth
var consumer_key    = '';
var consumer_secret = '';
var token           = '';
var token_secret    = '';
var oauth_enabled   = false;

$(function() {
    if (!screen_name) { return; }
    chrome.extension.sendRequest('consumer_access', function(response) {
        if ( response ) {
            consumer_key    = response[0];
            consumer_secret = response[1];
            token           = response[2];
            token_secret    = response[3];
            oauth_enabled   = true;
        }
        friend_append('-1');
    });
});

function friend_append(cursor) {
    $.getJSON(make_url(cursor), function(json) {
        cursor = json.next_cursor;
        $.map(json.users, function(n,i) { friends_list.push('@' + n.screen_name); });
        if ( cursor == 0 ) {
            statusbox.autocomplete(
                friends_list.sort(
                    function (a,b) {return a.toLowerCase()>b.toLowerCase()?1:-1;}
                )
            );
        }
        else {
            friend_append(cursor);
        }
    });
}

function make_url(cursor) {
    if ( !cursor ) { cursor = '-1'; }
    if ( oauth_enabled ) {
        var message  = make_message();
        var accessor = make_accessor();

        message.parameters.cursor = cursor;

        OAuth.completeRequest(     message, accessor);
        OAuth.SignatureMethod.sign(message, accessor);

        return friends_url + '?' + OAuth.formEncode(message.parameters);
    }

    return friends_url + '?screen_name='+screen_name + '&cursor=' + cursor;
}

function make_message() {
    return {
        action     : friends_url,
        method     : 'GET',
        parameters : {screen_name:screen_name},
    };
}

function make_accessor() {
    return {
        consumerKey    : consumer_key,
        consumerSecret : consumer_secret,
        token          : token,
        token_secret   : token_secret
    };
}

function friend_sort(a,b) {
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
}
