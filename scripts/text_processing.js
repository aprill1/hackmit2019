var speechAnalysis = document.querySelector('.speech-analysis');
console.log(speechAnalysis);

processTextFunction = function (inputText) {
    function getFillerWords(text) {
        var textWords = text.split(/[^a-zA-Z']/).filter(function(word){return word !== ''});
        var fillers = textWords.filter(isFiller);
        return fillers;
    };
    
    const fillers = ["uh", "um"];

    function isFiller(word) {
        return fillers.includes(word.toLowerCase());
    };

    fillers_found = getFillerWords(inputText);
    frequencies = splitAndCount(fillers_found);
    //Change to use frequencies map
    return getFillerWords(inputText);
};

splitAndCount = function (list) {
    frequencies = new Map();
    unique_elements = new Set(list);
    for (element of unique_elements) {
        frequencies.set(element, countFrequency(list, element));
    }
    return frequencies;
};

countFrequency = function (list, element) {
    return list.filter(x => x === element).length;
};

iterateAndApply = function (list, function_to_apply) {
    new_list = []
    for (let i = 0; i < list.length; i++) {
        new_list.push(function_to_apply(list[i]));
    }
    return new_list;
};

(() => {
    var sample = "Hi, this new recording. Um, I got, I got a filler word in there. Uh, another one, the C, I'm trying to avoid the killer words."
    var fillers = document.createElement('h3');
    fillers.textContent = processTextFunction(sample);
    speechAnalysis.appendChild(fillers);
})();