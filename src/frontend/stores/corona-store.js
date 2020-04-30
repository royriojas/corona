import { computed, action, observable } from 'mobx';
import lru from 'lru2';
import countriesData from '../../data/countries.json';
import cases from '../../data/cases.json';
import deaths from '../../data/deaths.json';
import recovered from '../../data/recovered.json';

class CoronaStore {
  @observable.shallow
  _countries = [];

  @observable.shallow
  _selectedCountries = ['Peru', 'US', 'Ecuador', 'Italy'];

  constructor() {
    this._countries = countriesData;
    this._deaths = deaths;
    this._cases = cases;
    this._recovered = recovered;

    this._lruCountries = lru.create({ limit: 500 });
  }

  @computed
  get countries() {
    return this._countries;
  }

  getCountryById = id => {
    let country = this._lruCountries.get(id);
    if (!country) {
      country = this._countries.find(c => c.value === id);

      this._lruCountries.set(id, country);

      return country;
    }

    return country;
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
    const indexOfGreaterThanZero = data.findIndex(entry => entry.y > 10);
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

  @computed
  get recoveredByCountry() {
    if (this.selectedCountries.length === 0) return [];
    return this._recovered
      .filter(entry => this.selectedCountries.includes(entry.id))
      .map(entry => ({
        ...entry,
        data: this.filterEmptyAtBegining(entry.data),
      }));
  }
}

export const coronaStore = new CoronaStore();
