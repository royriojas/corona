import { computed, observable, action } from 'mobx';
import { screenIsAtLeast, initLayoutHelper, sizes } from '../window-size-tracker';

class Screen {
  @observable
  size = '';

  @action
  setSize = size => {
    this.size = size;
  };

  @computed
  get matchXSmall1() {
    return screenIsAtLeast(this.size, sizes.xsmall1);
  }

  @computed
  get matchXSmall2() {
    return screenIsAtLeast(this.size, sizes.xsmall2);
  }

  @computed
  get matchSmall1() {
    return screenIsAtLeast(this.size, sizes.small1);
  }

  @computed
  get matchSmall2() {
    return screenIsAtLeast(this.size, sizes.small2);
  }

  @computed
  get matchMedium() {
    return screenIsAtLeast(this.size, sizes.medium);
  }

  @computed
  get matchLarge() {
    return screenIsAtLeast(this.size, sizes.large);
  }

  @computed
  get matchXLarge() {
    return screenIsAtLeast(this.size, sizes.xlarge);
  }
}

export const getScreenSizeStore = () => {
  const screen = new Screen();

  initLayoutHelper(size => {
    screen.setSize(size);
  });

  return screen;
};
