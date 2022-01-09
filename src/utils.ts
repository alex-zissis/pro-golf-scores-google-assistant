import {fileURLToPath} from 'url';

const dirname = fileURLToPath(import.meta.url);

const addHoursToDate = (date: Date, hours: number) => {
    const outputDate = new Date();
    outputDate.setHours(date.getHours() + hours);
    return outputDate;
};

export {addHoursToDate, dirname};
