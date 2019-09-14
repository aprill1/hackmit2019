const revai = require('revai-node-sdk');
const fs = require('fs');
const token = "02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo";

export async function uploadToAPI(URL)
{
    function getTranscript(id)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.setRequestHeader("Authorization", "Bearer 02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo");
        xmlHttp.setRequestHeader("Accept", "text/plain");
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                console.log(xmlHttp.responseText);
                return xmlHttp.responseText;
            }
        }
        xmlHttp.open("GET", "https://api.rev.ai/speechtotext/v1/jobs/" + id + "/transcript", true); // true for asynchronous 
        xmlHttp.send(null);
    }

    function checkStatus(id)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.setRequestHeader("Authorization", "Bearer 02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo");
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                console.log(xmlHttp.responseText);
                return xmlHttp.responseText;
            }
        }
        xmlHttp.open("GET", "https://api.rev.ai/speechtotext/v1/jobs/" + id, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    function sendFileAsync(url)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.setRequestHeader("Authorization", "Bearer 02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo");
        xmlHttp.setRequestHeader("Content-Type", "application/json");
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                console.log(xmlHttp.responseText);
                return xmlHttp.responseText;
            }
                
        }
        xmlHttp.open("POST", "https://api.rev.ai/speechtotext/v1/jobs", true); // true for asynchronous 
        xmlHttp.send("{\"media_url\":\"" + url + "\",\"metadata\":\"A voice recording we want to test\"}");
    }

  console.log("---------- uploading to API ----------");
  // Initialize your client with your revai access token
  //var client = new revai.RevAiApiClient(token);

  // Get account details
  //var account = await client.getAccount();
  //console.log(`Account: ${account.email}`);
  //console.log(`Balance: ${account.balance_seconds} seconds`);

  // Media may be submitted from a local file
  //var job = await client.submitJobUrl(URL);
  var job = await JSON.parse(sendFileAsync(URL));

  console.log(`Job Id: ${job.id}`);
  console.log(`Status: ${job.status}`);
  console.log(`Created On: ${job.created_on}`);

  /**
   * Waits 5 seconds between each status check to see if job is complete.
   * note: polling for job status is not recommended in a non-testing environment.
   * Use the callback_url option (see: https://www.rev.ai/docs#section/Node-SDK)
   * to receive the response asynchronously on job completion
   */

  while((jobStatus = (await JSON.parse(checkStatus(job.id)).status)) == "in_progress")
  {  
      console.log(`Job ${job.id} is ${jobStatus}`);
      await new Promise( resolve => setTimeout(resolve, 5000));
  }

  /** 
   * Get transcript as plain text
   */
  //var transcriptText = await client.getTranscriptText(job.id);
  var transcriptText = 
  console.log(transcriptText);
  console.log("---------- done uploading to API ----------");
}


var sample = "Hi, this new recording. Um, I got, I got a filler word in there. Uh, another one, the C, I'm trying to avoid the killer words."

function getFillerWords(text) {
    var textWords = text.split(/[^a-zA-Z']/).filter(function(word){return word !== ''});
    var fillers = textWords.filter(isFiller);
    console.log(fillers);
}

const fillers = ["uh", "um"];

function isFiller(word) {
    return fillers.includes(word.toLowerCase());
}

getFillerWords(sample);

// (async () => {  
//     // Initialize your client with your revai access token
//     var client = new revai.RevAiApiClient(token);

//     // Get account details
//     var account = await client.getAccount();
//     console.log(`Account: ${account.email}`);
//     console.log(`Balance: ${account.balance_seconds} seconds`);

//     // Media may be submitted from a local file
//     var job = await client.submitJobLocalFile("./audio_files/test.m4a");

//     console.log(`Job Id: ${job.id}`);
//     console.log(`Status: ${job.status}`);
//     console.log(`Created On: ${job.created_on}`);

//     /**
//      * Waits 5 seconds between each status check to see if job is complete.
//      * note: polling for job status is not recommended in a non-testing environment.
//      * Use the callback_url option (see: https://www.rev.ai/docs#section/Node-SDK)
//      * to receive the response asynchronously on job completion
//      */
//     while((jobStatus = (await client.getJobDetails(job.id)).status) == "in_progress")
//     {  
//         console.log(`Job ${job.id} is ${jobStatus}`);
//         await new Promise( resolve => setTimeout(resolve, 5000));
//     }

//     /** 
//      * Get transcript as plain text
//      */
//     var transcriptText = await client.getTranscriptText(job.id);
//     console.log(transcriptText);
// })();