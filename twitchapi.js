// Note: Does not handle pagination yet
var Twitch = {
    bearerToken: null,
};

// Get an app token
Twitch.getAppToken = function(callback) {
    return new Promise(function(successCallback, failureCallback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://id.twitch.tv/oauth2/token", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function(event) {
            // Get the token and pass it to callback
            responseJson = JSON.parse(this.response);
            successCallback(responseJson.access_token);
        };
        xhr.send(JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "client_credentials",
            scope: ""
        }));
    });
}

Twitch.get = function(uri, returnFirst, usedRetries) {
    return new Promise(function(successCallback, failureCallback) {
        // Retries
        usedRetries = usedRetries || 0;
        if(usedRetries >= MAX_RETRIES) {
            failureCallback();
            return;
        }

        // Do the request
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://api.twitch.tv/" + uri, true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Bearer ' + Twitch.bearerToken);
        xhr.setRequestHeader('Client-Id', CLIENT_ID);

        xhr.onload = function(event) {
            // Token error
            if(this.status == 400 || this.status == 401 || this.status == 404) {
                Twitch.getAppToken().then(function(token) {
                    Twitch.bearerToken = token;
                    console.log('Twitch.get('+uri+') failed!');
                    console.log('try again with token: ' + token);
                    usedRetries++;
                    Twitch.get(uri, returnFirst, usedRetries).then(successCallback);
                });
            } 
            // Success
            if(this.status == 200) {
                console.log('Twitch.get('+uri+') success!');
                responseJson = JSON.parse(this.response);
                // returnFirst is used for array resposnes, when we only want the first row
                successCallback(returnFirst ? responseJson.data[0] : responseJson.data);
            }
        };

        xhr.send();
    });    
}

Twitch.me = function() {
    return Twitch.get('helix/users?login=' + USER_LOGIN, true);
};

Twitch.getChannels = function(broadcasterId) {
    return Twitch.get('helix/channels?broadcaster_id=' + broadcasterId, true);
};

Twitch.myChannel = function() {
    return Twitch.me().then(function(user) {
        return Twitch.getChannels(user.id);
    });
};

Twitch.getLastFollower = function(userId) {
    return Twitch.get('helix/users/follows?to_id=' + userId, true);
}

Twitch.myLastFollower = function() {
    return Twitch.me().then(function(user) {
        return Twitch.getLastFollower(user.id);
    });
};

Twitch.getFollowers = function(userId) {
    return Twitch.get('helix/users/follows?to_id=' + userId);
};

Twitch.myFollowers = function(userId) {
    return Twitch.me().then(function(user) {
        return Twitch.getFollowers(user.id);
    });
};