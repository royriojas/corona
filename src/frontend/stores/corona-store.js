import { computed, action, observable } from 'mobx';
import countriesData from '../../data/countries.json';
import cases from '../../data/cases.json';
import deaths from '../../data/deaths.json';

class CoronaStore {
  @observable.shallow
  _countries = [];

  @observable.shallow
  _selectedCountries = [];

  constructor() {
    this._countries = countriesData;
    this._deaths = deaths;
    this._cases = cases;
  }

  @computed
  get countries() {
    return this._countries;
  }

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
    return this._deaths.filter(entry => this.selectedCountries.includes(entry.id));
  }

  @computed
  get casesByCountry() {
    if (this.selectedCountries.length === 0) return [];
    return this._cases.filter(entry => this.selectedCountries.includes(entry.id));
  }
}

export const coronaStore = new CoronaStore();
