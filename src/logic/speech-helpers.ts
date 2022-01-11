const addSpeechTags = (speech: string) => `<speak>${speech}</speak>`;
const addBreak = (speech: string, time: number = 1) => `${speech} <break time="${time}" /> `;
const addNumber = (num: number, interpretAs: 'ordinal' | 'cardinal' = 'cardinal') =>
    `<say-as interpret-as="${interpretAs}">${num}</say-as>`;
const addSubstitute = (stringToDisplay: string, stringToRead: string) =>
    `<sub alias="${stringToRead}">${stringToDisplay}</sub>`;

export {addBreak, addNumber, addSpeechTags, addSubstitute};
