const { pipeline } = require('stream');
const fs = require('fs');
const csvParse = require('csv-parse');
const path = require('path');
const mkdirp = require('mkdirp');
const { CountryList, parseRecord } = require('./CountryList');

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

const processByLine = async ({ input, output }) => {
  const dfd = createDeferred();
  const readStream = fs.createReadStream(input);

  const countryList = new CountryList();

  const p = pipeline(readStream, csvParse({ auto_parse: true }), async err => {
    if (err) {
      dfd.reject(err);
      return;
    }
    await writeInChunks(output, JSON.stringify(countryList.serialize(), null, 2));
    dfd.resolve();
  });

  let fields;
  let firstLine = true;

  p.on('data', record => {
    if (firstLine) {
      firstLine = false;

      fields = record;
      return;
    }

    const obj = parseRecord(record, fields);

    countryList.push(obj);
  });

  return dfd;
};

const main = async () => {
  await processByLine({
    input: './data.csv',
    output: './src/data/data-fixed.json',
  });
};

main()
  .then(() => console.log('done!'))
  .catch(err => console.error('>>> error', err));
