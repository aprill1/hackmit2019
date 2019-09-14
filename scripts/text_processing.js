var speechAnalysis = document.querySelector('.speech-analysis');

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

    var fillers_div = document.createElement('div');
    fillers_div.textContent = '';
    frequencies.forEach(
        function logMapElements(value, key, map) {
            var fillerDisplay = document.createElement('h3');
            fillerDisplay.textContent = `You said "${key}" ${value} time${value > 1 ? 's' : ''}`;
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

iterateAndApply = function (list, function_to_apply) {
    new_list = []
    for (let i = 0; i < list.length; i++) {
        new_list.push(function_to_apply(list[i]));
    }
    return new_list;
};

(() => {
    var sample = "Hi, this new recording. Um, I got, I got a filler word in there. Uh, another one, the C, I'm trying to avoid the killer words."
    processTextFunction(sample)
})();