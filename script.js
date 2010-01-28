var friends = "http://twitter.com/statuses/friends.json";

var statusbox = $("#status");

var data;
$.getJSON(friends, function(json) {
    data = $.map(json, function(n,i) {
       return "@" + n.screen_name;
    });
    statusbox.autocomplete(
        data.sort(
            function(a,b){return a.toLowerCase()>b.toLowerCase()?1:-1; }
        )
    );
});
// XXX todo:
    // 1. all friends, not just 100
    // 2. animating "working" plugin icon
    // 3. figure out auth stuff
    // 4. new icon
