import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './scrollr.html';
import stylesUrl from './scrollr.css';
import { ScrollData } from '../models/scroll-data';
import { timer } from './scrollr-static';

export class Scrollr extends CustomElementBase {
  private readonly _x: HTMLElement;
  private readonly _y: HTMLElement;

  private _scroll: ScrollData;
  private _timer: NodeJS.Timeout;
  private _connected: boolean;

  constructor() {
    super(stylesUrl, markupUrl);
    this._x = this.root.querySelector('.track.x .bar');
    this._y = this.root.querySelector('.track.y .bar');
  }

  connectedCallback() {
    const scrollr = this._x.closest('.scrollr');
    const trackX: HTMLElement = this._x.closest('.track');
    const trackY: HTMLElement = this._y.closest('.track');

    if (!this._connected) {
      this._connected = true;

      window.addEventListener('resize', () => this.apply_sizing(scrollr, trackX, trackY));
      scrollr.addEventListener('scroll', () => this.scrollr_scroll(scrollr, trackX, trackY));
      scrollr.addEventListener('wheel', (e: WheelEvent) => this.apply_wheel(e, scrollr, 'y'));
      trackX.addEventListener('wheel', (e: WheelEvent) => this.apply_wheel(e, scrollr, 'x'));
      trackX.addEventListener('click', (e: MouseEvent) => this.track_click(e, scrollr, 'x'));
      trackY.addEventListener('click', (e: MouseEvent) => this.track_click(e, scrollr, 'y'));
      trackX.addEventListener('mouseover', () => {
        if (this._scroll?.axis != 'y') trackX.classList.add('active');
      });
      trackY.addEventListener('mouseover', () => {
        if (this._scroll?.axis != 'x') trackY.classList.add('active');
      });
      trackX.addEventListener('mouseout', () => {
        if (!this._scroll) trackX.classList.remove('active');
      });
      trackY.addEventListener('mouseout', () => {
        if (!this._scroll) trackY.classList.remove('active');
      });
      this._x.addEventListener('click', (e) => e.stopPropagation());
      this._y.addEventListener('click', (e) => e.stopPropagation());
      this._x.addEventListener('mousedown', (e) => this.bar_mousedown(e, 'x'));
      this._y.addEventListener('mousedown', (e) => this.bar_mousedown(e, 'y'));
      window.addEventListener('mousemove', (e: MouseEvent) => {
        if (this._scroll) this.apply_drag(e, scrollr);
      });
      trackX.addEventListener('mouseup', (e) => this.track_mouseup(e, scrollr, 'x'));
      trackY.addEventListener('mouseup', (e) => this.track_mouseup(e, scrollr, 'y'));
      window.addEventListener('mouseup', () => {
        this._scroll = null;
        scrollr.querySelectorAll('.track.active').forEach((el) => el.classList.remove('active'));
      });
    }

    setTimeout(() => this.apply_sizing(scrollr, trackX, trackY));
  }

  private track_mouseup(e: Event, scrollr: Element, axis: 'x' | 'y') {
    const retainActive = this._scroll == null
       || (this._scroll.axis == axis && this._scroll.ref == scrollr);
    this._scroll = null;
    if (retainActive) {
      e.stopImmediatePropagation();
    }
  }

  private bar_mousedown(e: MouseEvent, axis: 'x' | 'y') {
    const page = this.axisProp(e, axis, 'page', 'XY');
    const bar = axis == 'x' ? this._x : this._y;
    const barOffset = this.axisProp(bar, axis, 'offset', 'LT');
    this._scroll = { axis, page, ref: bar.closest('.scrollr'), barOffset };
  }

  private track_click(e: MouseEvent, scrollr: any, axis: 'x' | 'y') {
    clearTimeout(this._timer);
    const bar = axis == 'x' ? this._x : this._y;
    const mOffset = this.axisProp(e, axis, 'offset', 'XY');
    const bOffset = this.axisProp(bar, axis, 'offset', 'LT');
    const trackSize = this.axisProp(scrollr, axis, 'client', 'WH');
    const sPropName = this.axisPropName(axis, 'scroll', 'LT');
    const p0 = scrollr[sPropName];
    const unit = mOffset <= bOffset ? 30 - trackSize : trackSize - 30;
    const rawx = (getComputedStyle(e.target as Element).transitionDuration);
    const duration = (parseFloat(rawx.replace('s', '')) ?? 0.3) * 1000;
    this._timer = timer(p => scrollr[sPropName] = p0 + (p * unit), duration, .5);
  }

  private scrollr_scroll(scrollr: Element, trackX: HTMLElement, trackY: HTMLElement): void {
    const sX = scrollr.scrollLeft;
    const sY = scrollr.scrollTop;
    trackX.style.left = sX + 'px';
    trackX.style.bottom = -sY + 'px';
    trackY.style.top = sY + 'px';
    trackY.style.right = -sX + 'px';

    const pX = sX / (scrollr.scrollWidth - scrollr.clientWidth);
    const pY = sY / (scrollr.scrollHeight - scrollr.clientHeight);
    const xAbs = pX * (trackX.clientWidth - this._x.clientWidth);
    const yAbs = pY * (trackY.clientHeight - this._y.clientHeight);
    this._x.style.left = xAbs + 'px';
    this._y.style.top = yAbs + 'px';
  }

  private apply_drag(e: MouseEvent, scrollr: any) {
    e.preventDefault();
    const axis = this._scroll.axis;
    const bar = axis == 'x' ? this._x : this._y;
    const track: any = bar.closest('.track');
    const lengthProp = this.axisPropName(axis, 'client', 'WH');
    const total = this.axisProp(scrollr, axis, 'scroll', 'WH');
    const max = total - track[lengthProp];
    const room = track[lengthProp] - (bar as any)[lengthProp];
    const delta = this.axisProp(e, axis, 'page', 'XY') - this._scroll.page;
    const abs = this._scroll.barOffset + delta;
    const offsetProp = this.axisPropName(axis, 'scroll', 'LT');
    scrollr[offsetProp] = (max * abs) / room;
  }

  private apply_wheel(e: WheelEvent, scrollr: any, axis: 'x' | 'y') {
    e.stopPropagation();
    const sPropName = this.axisPropName(axis, 'scroll', 'LT');
    const s0 = scrollr[sPropName];
    scrollr[sPropName] += e.deltaY;
    if (scrollr[sPropName] !== s0) e.preventDefault();
  }

  private apply_sizing(scrollr: Element, trackX: HTMLElement, trackY: HTMLElement): void {
    const rX = scrollr.clientWidth / scrollr.scrollWidth;
    const rY = scrollr.clientHeight / scrollr.scrollHeight;
    trackX.classList.toggle('hide', rX >= 1);
    trackY.classList.toggle('hide', rY >= 1);
    this._x.style.width = this.percentText(rX);
    this._y.style.height = this.percentText(rY);
  }

  private percentText = (frac: number) => `${(100 * frac).toFixed(2)}%`;

  private axisPropName = (
    axis: 'x' | 'y',
    prefix: 'client' | 'delta' | 'offset' | 'page' | 'scroll',
    type: 'LT' | 'WH' | 'XY'
  ): string => {
    switch (type) {
      case 'LT':
        return `${prefix}${axis == 'x' ? 'Left' : 'Top'}`;
      case 'WH':
        return `${prefix}${axis == 'x' ? 'Width' : 'Height'}`;
      case 'XY':
        return `${prefix}${axis == 'x' ? 'X' : 'Y'}`;
    }
  };

  private axisProp = (
    element: any,
    axis: 'x' | 'y',
    prefix: 'client' | 'delta' | 'offset' | 'page' | 'scroll',
    type: 'LT' | 'WH' | 'XY'
  ): number => {
    const propName = this.axisPropName(axis, prefix, type);
    return element[propName];
  };
}
