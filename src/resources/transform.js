import { readJSON } from './common/xfs';

const { DateTime } = require('luxon');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { CountryList } = require('./CountryList');

const createDeferred = () => {
  let resolve;
  let reject;

  const p = new Promise((r, rjt) => {
    resolve = r;
    reject = rjt;
  });

  p.resolve = (...args) => resolve(...args);
  p.reject = (...args) => reject(...args);

  return p;
};

const writeToStream = (stream, data) =>
  new Promise(resolve => {
    if (!stream.write(data)) {
      stream.removeAllListeners('drain'); // avoid memory leak warning
      stream.once('drain', resolve);
    } else {
      process.nextTick(resolve);
    }
  });

const writeInChunks = async (filePath, data) => {
  const dfd = createDeferred();
  await mkdirp(path.dirname(filePath));

  const stream = fs.createWriteStream(filePath);

  stream.on('open', async () => {
    let chunkCount = 0;
    const charsPerChunk = 100;
    const maxChunks = Math.ceil(data.length / charsPerChunk);
    do {
      const currentChunk = data.substr(chunkCount * charsPerChunk, charsPerChunk);

      await writeToStream(stream, currentChunk);

      chunkCount++;
    } while (chunkCount < maxChunks);

    stream.end(() => {
      dfd.resolve();
    });

    return dfd;
  });
};

const processByLine = async ({ input, countriesFile, casesFile, deathsFile, recoveredFile }) => {
  const jsonData = await readJSON(input);

  const countryList = new CountryList();

  Object.keys(jsonData).forEach(country => {
    const countryData = jsonData[country];
    countryData.forEach(rec => {
      const record = {
        date: DateTime.fromFormat(rec.date, 'yyyy-MM-dd'),
        cases: rec.confirmed,
        deaths: rec.deaths,
        geoId: country,
        code: country,
        country,
        recovered: rec.recovered,
      };
      countryList.push(record);
    });
  });

  const data = countryList.serialize();

  await writeInChunks(countriesFile, JSON.stringify(data.countries, null, 2));
  await writeInChunks(casesFile, JSON.stringify(data.cases, null, 2));
  await writeInChunks(deathsFile, JSON.stringify(data.deaths, null, 2));
  await writeInChunks(recoveredFile, JSON.stringify(data.recovered, null, 2));
};

const main = async () => {
  await processByLine({
    input: './data.json',
    countriesFile: './src/data/countries.json',
    casesFile: './src/data/cases.json',
    deathsFile: './src/data/deaths.json',
    recoveredFile: './src/data/recovered.json',
  });
};

main()
  .then(() => console.log('done!'))
  .catch(err => console.error('>>> error', err));
