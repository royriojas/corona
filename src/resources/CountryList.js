const { DateTime } = require('luxon');

const asDate = d => DateTime.fromFormat(d, 'dd/MM/yyyy');
const asNumber = d => Number.parseFloat(d);
const asString = d => d;

class CountryEntry {
  data = {};

  dataPoints = [];

  set population(population) {
    this.data.population = population;
  }

  get population() {
    return this.data.population;
  }

  constructor(data) {
    this.data = data;
  }

  push(entry) {
    this.dataPoints.push(entry);
  }

  serialize() {
    const ret = this.dataPoints.reduce(
      (acc, entry) => {
        const { date, cases, deaths, recovered } = entry;

        acc.cases.push({ x: date, y: cases });
        acc.deaths.push({ x: date, y: deaths });
        acc.recovered.push({ x: date, y: recovered });

        return acc;
      },
      { deaths: [], cases: [], recovered: [] },
    );

    return {
      ...this.data,

      country: this.data.country.replace(/_/g, ' '),
      id: this.data.geoId,
      deaths: ret.deaths.sort((a, b) => (a.x < b.x ? -1 : 1)).map((entry, index) => ({ ...entry, date: entry.x.toISODate(), x: `day-${index}` })),
      cases: ret.cases.sort((a, b) => (a.x < b.x ? -1 : 1)).map((entry, index) => ({ ...entry, date: entry.x.toISODate(), x: `day-${index}` })),
      recovered: ret.recovered.sort((a, b) => (a.x < b.x ? -1 : 1)).map((entry, index) => ({ ...entry, date: entry.x.toISODate(), x: `day-${index}` })),
    };
  }
}

const parseRecord = (record, fields) => {
  const meta = {
    dateRep: { parser: asDate, renameTo: 'date' },
    cases: { parser: asNumber },
    deaths: { parser: asNumber },
    countriesAndTerritories: { parser: asString, renameTo: 'country' },
    countryterritoryCode: { parser: asString, renameTo: 'code' },
    popData2018: { parser: asNumber, renameTo: 'population' },
    geoId: { parser: asString },
  };

  const obj = fields.reduce((acc, key, index) => {
    const metaKey = meta[key];
    if (meta[key]) {
      const { parser, renameTo } = metaKey;

      acc[renameTo || key] = parser(record[index]);
    }

    return acc;
  }, {});

  return obj;
};

class CountryList {
  dataMap = new Map();

  get(id) {
    return this.dataMap.get(id);
  }

  set(id, countryEntry) {
    this.dataMap.set(id, countryEntry);
  }

  push(obj) {
    const { code, country, population, geoId, ...rest } = obj;

    if (!geoId) {
      console.error('>>> Cannot continue without a code', obj);
      throw new Error('Cannot continue without a code');
    }

    let countryEntry = this.get(geoId);

    if (!countryEntry) {
      countryEntry = new CountryEntry({ country, code, population, geoId });
      this.set(geoId, countryEntry);
    }

    countryEntry.push(rest);
  }

  updatePopulation = (id, population) => {
    const country = this.get(id);
    country.population = population;
  };

  serialize() {
    return Array.from(this.dataMap.values()).reduce(
      (acc, countryEntry) => {
        const entry = countryEntry.serialize();
        const { id, cases, deaths, recovered, country, ...rest } = entry;

        acc.countries.push({ value: id, label: country });
        acc.cases.push({ id, country, ...rest, data: cases });
        acc.deaths.push({ id, country, ...rest, data: deaths });
        acc.recovered.push({ id, country, ...rest, data: recovered });
        return acc;
      },
      { cases: [], deaths: [], countries: [], recovered: [] },
    );
  }
}

module.exports = { CountryEntry, CountryList, parseRecord };
