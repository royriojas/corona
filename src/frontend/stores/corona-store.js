import { computed, action, observable } from 'mobx';
import lru from 'lru2';
import countriesData from '../../data/countries.json';
import cases from '../../data/cases.json';
import deaths from '../../data/deaths.json';

class CoronaStore {
  @observable.shallow
  _countries = [];

  @observable.shallow
  _selectedCountries = ['Peru', 'US', 'Ecuador', 'Italy'];

  constructor() {
    this._countries = countriesData;
    this._deaths = deaths;
    this._cases = cases;

    this._lruByDeaths = lru.create({ limit: 500 });
    this._lruByCases = lru.create({ limit: 500 });
  }

  @computed
  get countries() {
    return this._countries;
  }

  getTooltipForDeathsByPoint = ({ serieId, index }) => {
    let tooltipData = this._lruByDeaths.get(serieId);
    if (!tooltipData) {
      const entry = this._deaths.find(c => c.id === serieId);
      const { country } = entry || {};

      const dataPoint = entry?.data?.[index] || {};

      tooltipData = { country, ...dataPoint };

      this._lruByDeaths.set(serieId, tooltipData);

      return tooltipData;
    }

    return tooltipData;
  };

  getTooltipForCasesByPoint = ({ serieId }) => {
    const key = serieId;
    let entry = this._lruByCases.get(key);
    if (!entry) {
      entry = this._cases.find(c => c.id === serieId);

      this._lruByCases.set(key, entry);

      return entry;
    }

    return entry;
  };

  @computed
  get selectedCountries() {
    return this._selectedCountries;
  }

  @action
  selectCountries = selectedCountries => {
    this._selectedCountries = selectedCountries;
  };

  @computed
  get deathsByCountry() {
    if (this.selectedCountries.length === 0) return [];
    return this._deaths
      .filter(entry => this.selectedCountries.includes(entry.id))
      .map(entry => ({
        ...entry,
        data: this.filterEmptyAtBegining(entry.data),
      }));
  }

  filterEmptyAtBegining = data => {
    const indexOfGreaterThanZero = data.findIndex(entry => entry.y > 0);
    if (indexOfGreaterThanZero > 0) {
      return data.slice(indexOfGreaterThanZero).map((entry, index) => ({ ...entry, x: `day-${index}` }));
    }

    return data;
  };

  @computed
  get casesByCountry() {
    if (this.selectedCountries.length === 0) return [];
    return this._cases.filter(entry => this.selectedCountries.includes(entry.id));
  }
}

export const coronaStore = new CoronaStore();
