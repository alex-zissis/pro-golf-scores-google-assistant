import numToWords from 'number-to-words';

const getReadableStringFromScore = (score: number) => {
    if (score === 0) {
        return 'Even par';
    } else if (score < 0) {
        return `<sub alias="${numToWords.toWords(Math.abs(score)).replace('-', ' ')} under">${score}</sub>`;
    } else {
        return `<sub alias="${numToWords.toWords(Math.abs(score)).replace('-', ' ')} over">+${score}</sub>`;
    }
};

export {getReadableStringFromScore};
