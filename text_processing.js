processTextFunction = function (inputText) {
    function getFillerWords(text) {
        var textWords = text.split(/[^a-zA-Z']/).filter(function(word){return word !== ''});
        var fillers = textWords.filter(isFiller);
        console.log(fillers);
    }
    
    const fillers = ["uh", "um"];

    function isFiller(word) {
        return fillers.includes(word.toLowerCase());
    }

    getFillerWords(inputText);
};

(() => {
	var sample = "Hi, this new recording. Um, I got, I got a filler word in there. Uh, another one, the C, I'm trying to avoid the killer words."
	processTextFunction(sample);
})();