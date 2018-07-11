var btn = document.getElementById('btn');
var logout = document.getElementById('logout');

chrome.storage.sync.get(['token'], function(result) {
    if(!result.token){
        hide(logout);
        show(btn);
    }else{
        show(logout);
        hide(btn);
    }
});

btn.onclick = function(){
    var poolData = {
        UserPoolId : 'ap-southeast-2_xxxxxxx', // your user pool id here
        ClientId : 'xxxxxxxxxxxxxxx' // your app client id here
    };
    var userPool = 
    new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username : document.getElementById('userName').value, // your username here
        Pool : userPool
    };
    var authenticationData = {
            Username : document.getElementById('userName').value, // your username here
            Password : document.getElementById('password').value, // your password here
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var token = result.getIdToken().getJwtToken()
            chrome.storage.sync.set({token: token}, function() {
                console.log("The token is: " + token);
            });
            show(logout);
            hide(btn);
        },

        onFailure: function(err) {
            alert(JSON.stringify(err));
        },
        mfaRequired: function(codeDeliveryDetails) {
            var verificationCode = prompt('Please input verification code' ,'');
            cognitoUser.sendMFACode(verificationCode, this);
        }
    });
}

logout.onclick = function(){
    show(btn);
    hide(logout);
    chrome.storage.sync.set({token: null}, function() {
        console.log("The token cleared!");
    });
}

function hide(element){
    element.style.display = "none";
}

function show(element){
    element.style.display = "block";
}