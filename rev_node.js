const revai = require('revai-node-sdk');
const fs = require('fs');
const token = "02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo";

export async function uploadToAPI(URL)
{
  console.log("---------- uploading to API ----------");
  // Initialize your client with your revai access token
  var client = new revai.RevAiApiClient(token);

  // Get account details
  var account = await client.getAccount();
  console.log(`Account: ${account.email}`);
  console.log(`Balance: ${account.balance_seconds} seconds`);

  // Media may be submitted from a local file
  var job = await client.submitJobUrl(URL);

  console.log(`Job Id: ${job.id}`);
  console.log(`Status: ${job.status}`);
  console.log(`Created On: ${job.created_on}`);

  /**
   * Waits 5 seconds between each status check to see if job is complete.
   * note: polling for job status is not recommended in a non-testing environment.
   * Use the callback_url option (see: https://www.rev.ai/docs#section/Node-SDK)
   * to receive the response asynchronously on job completion
   */
  while((jobStatus = (await client.getJobDetails(job.id)).status) == "in_progress")
  {  
      console.log(`Job ${job.id} is ${jobStatus}`);
      await new Promise( resolve => setTimeout(resolve, 5000));
  }

  /** 
   * Get transcript as plain text
   */
  var transcriptText = await client.getTranscriptText(job.id);
  console.log(transcriptText);
  console.log("---------- done uploading to API ----------");
}

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