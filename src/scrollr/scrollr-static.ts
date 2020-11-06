export function apply(q: string | Element, className: string): void {
  const wrapper = document.createElement('ne14-scrollr');
  const elemLike = typeof (q as Element).append === 'function';
  const target = elemLike ? (q as Element) : document.querySelector(q + '');

  wrapper.className = className;
  target.parentElement.append(wrapper);
  wrapper.append(target);
}

export function timer(
    callback: (prog: number) => void,
    duration: number = 300,
    exponent: number = 1,
    frequency: number = 10): NodeJS.Timeout {

  callback(0);
  const t0 = new Date().getTime();
  let elapse, linear;

  const interval = setInterval(() => {
    elapse = new Date().getTime() - t0;
    linear = Math.min(duration, elapse) / duration;
    callback(Math.pow(linear, exponent));
    if (linear === 1) clearInterval(interval);
  }, frequency);

  return interval;
};