import { Scrollr } from './scrollr/scrollr';

if ('customElements' in window) {
  window.customElements.define('ne14-scrollr', Scrollr);
}

export { Scrollr };
