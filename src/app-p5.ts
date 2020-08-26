import './img/favicon.ico';
import './styles/input-form.scss';
import p5 from 'p5';

(() => {
  'use strict';

  const sketch = (p: p5): void => {
    const width: number = 200;
    const height: number = 200;
    const increaseX: number = 0.01;
    const increaseY: number = 0.01;

    p.setup = (): void => {
      p.createCanvas(width, height);
      p.pixelDensity(1);
    };

    p.draw = (): void => {
      // Refer: https://p5js.org/reference/#/p5/loadPixels
      p.loadPixels();

      // We can control a quality of noise that we'll make.
      // p.noiseDetail(4, 0.75);

      let i,
        r,
        offsetX: number = 0;
      for (let x: number = 0; x < width; x++) {
        let offsetY: number = 0;
        for (let y: number = 0; y < height; y++) {
          i = 4 * (x + y * height);
          r = p.noise(offsetX, offsetY) * 255;

          p.pixels[i + 0] = r;
          p.pixels[i + 1] = r;
          p.pixels[i + 2] = r;
          p.pixels[i + 3] = 255;

          offsetY += increaseY;
        }

        offsetX += increaseX;
      }

      p.updatePixels();
      // p.noLoop();
    };
  };

  function init() {
    const _p5 = new p5(sketch, document.getElementById('canvas-p5') as HTMLElement);
  }

  init();
})();
