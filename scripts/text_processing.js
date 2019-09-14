var speechAnalysis = document.querySelector('.speech-analysis');
console.log(speechAnalysis);

processTextFunction = function (inputText) {
    function getFillerWords(text) {
        var textWords = text.split(/[^a-zA-Z']/).filter(function(word){return word !== ''});
        var fillers = textWords.filter(isFiller);
        return fillers;
    }
    
    const fillers = ["uh", "um"];

    function isFiller(word) {
        return fillers.includes(word.toLowerCase());
    }

    return getFillerWords(inputText);
};

(() => {
	var sample = "Hi, this new recording. Um, I got, I got a filler word in there. Uh, another one, the C, I'm trying to avoid the killer words."
    var fillers = document.createElement('h3');
    fillers.textContent = processTextFunction(sample);
    speechAnalysis.appendChild(fillers);
})();