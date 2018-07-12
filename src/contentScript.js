var css = '.ytbtn { border: 1px solid black; border-radius: 5px; padding: 10px; background: green; z-index:10000; position: absolute;} .ytbtn:hover {background-color: yellow;}'
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
var btn = createBtn();
document.body.appendChild(btn);

setInterval(function(){
    if(window.location.href.includes("www.youtube.com/watch"))
    {
        show(btn);
    }else{
        hide(btn);
    }
},1000);


function createBtn(){
    var btn = document.createElement("div");
    btn.innerHTML = 'Download Mp3';
    btn.className = 'ytbtn';
    btn.onclick = function(){
        chrome.storage.sync.get(['token'], function(result) {
            if(!result.token){
                alert("Please login first!");
            }
            console.log('Token is ' + result.token);
            AWS.config.region = 'ap-southeast-2';
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'ap-southeast-2:xxxxxx-xxxx-46ae-81f6-0da9794685a8',
                Logins: {
                    'cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_xxxxxxx': result.token
                }
            });
    
            var sns = new AWS.SNS({apiVersion: '2010-03-31'});
            var msg = {"Url":window.location.href,"Id": uuidv4(),"TimeStamp":moment().format()};
            
            var params = {
                Message: JSON.stringify(msg), /* required */
                Subject: 'YoutubeDownloadCommand',
                TopicArn: 'arn:aws:sns:ap-southeast-2:xxxxxxxx:youtubedownloadcommand'
            };
            sns.publish(params, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
            });
        });
    }

    return btn;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function hide(element){
    element.style.display = "none";
}

function show(element){
    element.style.display = "block";
}