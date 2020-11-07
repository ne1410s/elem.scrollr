export function apply(selector: string | Element, newClass: string): void {
  const wrapper = document.createElement('ne14-scrollr');
  const elemLike = typeof (selector as Element).append === 'function';
  const target = elemLike ? (selector as Element) : document.querySelector(selector + '');

  wrapper.className = newClass;
  target.parentElement.append(wrapper);
  wrapper.append(target);
}

export function timer(
  callback: (prog: number) => void,
  duration: number = 300,
  exponent: number = 1,
  frequency: number = 10
): NodeJS.Timeout {
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
}
