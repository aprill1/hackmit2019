var speechAnalysis = document.querySelector('.speech-analysis');
const defaultFillers = ["uh", "um"];
var additionalFillers = [];

addToFillers = function (fillers) {
    additionalFillers = fillers;
}

processTextFunction = function (inputText) {
    var trackedFillers = defaultFillers.concat(additionalFillers);
    function getFillerWords(text) {
        var textWords = text.split(/[^a-zA-Z']/).filter(function(word){return word !== ''});
        var fillers = textWords.filter(isFiller);
        return fillers;
    };

    function isFiller(word) {
        return trackedFillers.includes(word);
    };

    fillers_found = getFillerWords(inputText);
    frequencies = splitAndCount(fillers_found);

    var fillers_div = document.createElement('div');
    fillers_div.textContent = '';
    frequencies.forEach(
        function logMapElements(value, key, map) {
            var fillerDisplay = document.createElement('h3');
            fillerDisplay.textContent = `You said "${key}" ${value} time${value !== 1 ? 's' : ''}`;
            fillers_div.appendChild(fillerDisplay);
          }          
    );
    speechAnalysis.appendChild(fillers_div);
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