'use strict';

const CLASS_NAME = 'peek-button';

class ResultImage {
  private readonly base: string;
  private readonly ext: string;
  constructor(thumbnail: string) {
    this.base = thumbnail.substring(0, 47);
    this.ext = thumbnail.split('.').slice(-1)[0];
  }

  private getFullImgSrc(): string {
    return this.base + '.' + this.ext;
  }

  makeButton(): HTMLElement {
    const d = document.createElement('div');
    d.classList.add('peek-container');
    const b = document.createElement('button');
    b.innerText = '\u{1F50D}';
    b.classList.add(CLASS_NAME);
    b.addEventListener('click', () => {
      window.open(this.getFullImgSrc(), '_blank');
    });
    d.append(b);
    return d;
  }
}

const addPeeker = () => {
  Array.from(document.getElementsByClassName('s-product-image-container'))
    .filter((elem) => {
      const p = elem.parentElement;
      return p && p.getElementsByClassName(CLASS_NAME).length < 1;
    })
    .forEach((elem) => {
      const img = elem.getElementsByTagName('img')[0];
      const src = img.getAttribute('src');
      if (!src) {
        return;
      }
      const res = new ResultImage(src);
      elem.before(res.makeButton());
    });
};

window.addEventListener('load', () => {
  const result = document.getElementById('search');
  if (!result) {
    return;
  }

  addPeeker();

  const observer = new MutationObserver(addPeeker);

  observer.observe(result, {
    childList: true,
    subtree: true,
  });
});
