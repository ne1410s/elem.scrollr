import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './scrollr.html';
import stylesUrl from './scrollr.css';

export class Scrollr extends CustomElementBase {
  public static readonly observedAttributes = ['style'];

  private static readonly STYLE_KEYS = ['width', 'height', 'maxWidth', 'maxHeight'];

  private _styles: Record<string, string> = {};

  constructor() {
    super(stylesUrl, markupUrl);
  }

  wrap(selectorOrElem: string | Element): void {
    const target =
      typeof (selectorOrElem as Element).append === 'function'
        ? (selectorOrElem as Element)
        : document.querySelector(selectorOrElem + '');
    this.appendChild(target);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'style':
        if (newValue) {
          Scrollr.STYLE_KEYS.map((key) => ({ key, value: (this.style as any)[key] }))
            .filter((kvp) => kvp.value)
            .forEach((kvp) => (this._styles[kvp.key] = kvp.value));
          this.removeAttribute('style');
        }
        break;
    }
  }

  connectedCallback() {
    this.propagateSupportedStyles();
  }

  disconnectedCallback() {
    // on disconnected from dom
  }

  /** Some relevant style properties are propagated */
  private propagateSupportedStyles() {
    const scrollr: HTMLElement = this.root.querySelector('.scrollr');
    Scrollr.STYLE_KEYS.forEach((prop) => {
      (scrollr.style as any)[prop] = this._styles[prop];
    });
  }

  /** Emits a new event. */
  private fire<T>(event: string, detail?: T) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

/*

 
(window => {

  let initCoords;

  const coords_update = e => {
    if (initCoords) {
      const elem = initCoords.bar.closest('.scrollr');
      const eSuffix = initCoords.axis.toUpperCase();
      const sSuffix = initCoords.axis == 'x' ? 'Left' : 'Top';
      const dSuffix = initCoords.axis == 'x' ? 'Width' : 'Height';
      const max = elem['scroll' + dSuffix] - elem['client' + dSuffix];
      const room = elem['client' + dSuffix] - initCoords.bar['client' + dSuffix];
      const delta = e['page' + eSuffix] - initCoords.abs;
      const abs = initCoords.p0 + delta;
      elem['scroll' + sSuffix] = max * abs / room;
    }
  };

  const scrollr_resize = elem => {
    const xBar = elem.querySelector('.track.x .bar');
    const yBar = elem.querySelector('.track.y .bar');
    const xRel = elem.clientWidth / elem.scrollWidth;
    const yRel = elem.clientHeight / elem.scrollHeight;
    xBar.style.width = (100 * xRel).toFixed(2) + '%';
    yBar.style.height = (100 * yRel).toFixed(2) + '%';
  };

  const scrollr_init = elem => {
    const xTrack = document.createElement('span');
    const yTrack = document.createElement('span');
    const xBar = document.createElement('span');
    const yBar = document.createElement('span');
    xTrack.className = 'track x';
    yTrack.className = 'track y';
    xBar.className = 'bar';
    yBar.className = 'bar';
    xTrack.appendChild(xBar);
    yTrack.appendChild(yBar);
    elem.appendChild(xTrack);
    elem.appendChild(yTrack);
    elem.addEventListener('wheel', scrollr_OnWheel);
    elem.addEventListener('scroll', scrollr_OnScroll);
    xTrack.addEventListener('wheel', xTrack_OnWheel);
    xTrack.addEventListener('click', xTrack_OnClick);
    xTrack.addEventListener('mouseover', () => {
      if ((initCoords || {}).axis != 'y') xTrack.classList.add('active');
    });
    xTrack.addEventListener('mouseout', () => {
      if (!initCoords) xTrack.classList.remove('active');
    });
    yTrack.addEventListener('click', yTrack_OnClick);
    yTrack.addEventListener('mouseover', () => {
      if ((initCoords || {}).axis != 'x') yTrack.classList.add('active');
    });
    yTrack.addEventListener('mouseout', () => {
      if (!initCoords) yTrack.classList.remove('active');
    });
    xBar.addEventListener('click', bar_OnClick);
    xBar.addEventListener('mousedown', xBar_OnMouseDown);
    yBar.addEventListener('click', bar_OnClick);
    yBar.addEventListener('mousedown', yBar_OnMouseDown);

    scrollr_resize(elem);
  };

  window.addEventListener('load', e => {
    const scrollrz = Array.from(document.querySelectorAll('.scrollr'));
    scrollrz.forEach(scrollr_init);
  });

  window.addEventListener('resize', e => {
    const scrollrz = Array.from(document.querySelectorAll('.scrollr'));
    scrollrz.forEach(scrollr_resize);
  });

  window.addEventListener('mousemove', coords_update);
  window.addEventListener('mouseup', e => {
    initCoords = null;
    Array.from(document.querySelectorAll('.track.active'))
      .forEach(elem => elem.classList.remove('active'));
  });

  function xBar_OnMouseDown(e) {
    const p0 = this.offsetLeft;
    initCoords = {
      axis: 'x',
      abs: e.pageX,
      bar: this,
      p0
    };
  }

  function yBar_OnMouseDown(e) {
    const p0 = this.offsetTop;
    initCoords = {
      axis: 'y',
      abs: e.pageY,
      bar: this,
      p0
    };
  }

  function bar_OnClick(e) {
    e.stopPropagation();
  }

  function xTrack_OnClick(e) {
    const elem = this.closest('.scrollr');
    const xBar = this.querySelector('.bar');
    let unit = elem.clientWidth - 30;
    if (e.offsetX <= xBar.offsetLeft) unit *= -1;
    elem.scrollLeft += unit;
  }

  function yTrack_OnClick(e) {
    const elem = this.closest('.scrollr');
    const yBar = this.querySelector('.bar');
    let unit = elem.clientHeight - 30;
    if (e.offsetY <= yBar.offsetTop) unit *= -1;
    elem.scrollTop += unit;
  }

  function xTrack_OnWheel(e) {
    e.stopPropagation();
    const elem = this.closest('.scrollr');
    const left0 = elem.scrollLeft;
    const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
    elem.scrollLeft += delta;
    const moved = left0 !== elem.scrollLeft;
    if (moved) e.preventDefault();
  }

  function scrollr_OnWheel(e) {
    const left0 = this.scrollLeft;
    const top0 = this.scrollTop;
    this.scrollLeft += e.deltaX;
    this.scrollTop += e.deltaY;
    const moved = left0 !== this.scrollLeft || top0 !== this.scrollTop;
    if (moved) e.preventDefault();
  }

  function scrollr_OnScroll(e) {
    const xTrack = this.querySelector('.track.x');
    const yTrack = this.querySelector('.track.y');
    const xBar = xTrack.querySelector('.bar');
    const yBar = yTrack.querySelector('.bar');

    const xMax = this.scrollWidth - this.clientWidth;
    const yMax = this.scrollHeight - this.clientHeight;
    const xFrac = this.scrollLeft / xMax;
    const yFrac = this.scrollTop / yMax;
    const xAbs = xFrac * (this.clientWidth - xBar.clientWidth);
    const yAbs = yFrac * (this.clientHeight - yBar.clientHeight);

    xTrack.style.left = this.scrollLeft + 'px';
    xTrack.style.bottom = -this.scrollTop + 'px';
    xBar.style.left = xAbs + 'px';

    yTrack.style.top = this.scrollTop + 'px';
    yTrack.style.right = -this.scrollLeft + 'px';
    yBar.style.top = yAbs + 'px';
  };

})(window);


*/
