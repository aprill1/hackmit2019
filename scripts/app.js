/**
 * Contributors: Yaseen Alkhafaji, April Xie, Brian Hoh, Carlos Trevino
 * 
 * Used code from https://github.com/mdn/web-dictaphone
 */

//  import { processTextFunction } from 'text_processing.js';

// set up basic variables for app

var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.querySelector('.sound-clips');
var canvas = document.querySelector('.visualizer');
var mainSection = document.querySelector('.main-controls');
var track = document.querySelector('.track');

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();
var canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  var constraints = { audio: true };
  var chunks = [];

  var onSuccess = function(stream) {
    var mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;

      // processTextFunction here
    }

    track.onclick = function() {
        var input = document.querySelector('input');
        var wordToTrack = [input.value];
        input.value = '';
        addToFillers(wordToTrack);
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
      console.log(clipName);
      var clipContainer = document.createElement('article');
      var clipLabel = document.createElement('p');
      var audio = document.createElement('audio');
      var deleteButton = document.createElement('button');
     
      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
      chunks = [];
      var audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log(audioURL);
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        var existingName = clipLabel.textContent;
        var newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      };

      (async() => {
        await uploadToAPI(blob);
      })()
      
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  var onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  var source = audioCtx.createMediaStreamSource(stream);

  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    WIDTH = canvas.width
    HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;


    for(var i = 0; i < bufferLength; i++) {
 
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();

// API CODE BELOW
async function uploadToAPI(URL)
{
    async function getTranscript(id)
    {
      return new Promise(function(resolve, reject) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https://api.rev.ai/speechtotext/v1/jobs/" + id + "/transcript", true); // true for asynchronous
        xmlHttp.setRequestHeader("Authorization", "Bearer 02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo");
        xmlHttp.setRequestHeader("Accept", "text/plain");
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                console.log(xmlHttp.responseText);
                resolve(xmlHttp.responseText);
            }
        } 
        xmlHttp.send(null);
      });
    }

    async function checkStatus(id)
    {
      return new Promise(function(resolve, reject)
      {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "https://api.rev.ai/speechtotext/v1/jobs/" + id, true); // true for asynchronous 
        xmlHttp.setRequestHeader("Authorization", "Bearer 02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo");
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                console.log(xmlHttp.responseText);
                resolve(xmlHttp.responseText);
            }
        }
        xmlHttp.send(null);
      });
    }

    function sendFileAsync(url)
    {
      return new Promise(function(resolve, reject)
      {
        var xmlHttp = new XMLHttpRequest();
          xmlHttp.open("POST", "https://api.rev.ai/speechtotext/v1/jobs", true); // true for asynchronous 
          xmlHttp.setRequestHeader("Authorization", "Bearer 02BxYhsK1vX4kf7yVf2vqWWIxk3dyFq6zvK4PMAgWGnmSotRvBY-8x7bRigOeaQ6rg9Hf8aNpLUUmj3bo-hkkFZwpyefo");
          xmlHttp.onreadystatechange = function() { 
              if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
              {
                  console.log("successful send");
                  console.log(xmlHttp.responseText);
                  resolve(xmlHttp.responseText);
              }
          }
          var asForm = new FormData();

          asForm.append("media", url);// new File(url, "myfile.ogg"));
          asForm.append("type", "audio/ogg");
          xmlHttp.send(asForm);
      });
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
  var res = await sendFileAsync(URL);
  console.log(res);
  var job = JSON.parse(res);

  console.log(`Job Id: ${job.id}`);
  console.log(`Status: ${job.status}`);
  console.log(`Created On: ${job.created_on}`);

  /**
   * Waits 5 seconds between each status check to see if job is complete.
   * note: polling for job status is not recommended in a non-testing environment.
   * Use the callback_url option (see: https://www.rev.ai/docs#section/Node-SDK)
   * to receive the response asynchronously on job completion
   */
  var jsonStatus = await checkStatus(job.id);
  var jobStatus = JSON.parse(jsonStatus).status;
  while( jobStatus == "in_progress")
  {  
      console.log(`Job ${job.id} is ${jobStatus}`);
      await new Promise( resolve => setTimeout(resolve, 1000));
      jsonStatus = await checkStatus(job.id);
      jobStatus = JSON.parse(jsonStatus).status;
  }

  /** 
   * Get transcript as plain text
   */
  //var transcriptText = await client.getTranscriptText(job.id);
  var transcriptText = getTranscript(job.id);
  processTextFunction(transcriptText.toString());
  console.log(transcriptText);
  console.log("---------- done uploading to API ----------");
}