import './src/env/node';

import type { Canvas as NodeCanvas, JpegConfig, PngConfig } from 'canvas';
import { getEnv, StaticCanvas as Canvas } from './fabric';
import { cleanUpJsdomNode } from './src/util/dom_misc';

export * from './fabric';

export class StaticCanvas extends Canvas {
  getNodeCanvas() {
    const impl = getEnv().jsdomImplForWrapper(this.lowerCanvasEl);
    return (impl._canvas || impl._image) as NodeCanvas;
  }
  createPNGStream(opts?: PngConfig) {
    return this.getNodeCanvas().createPNGStream(opts);
  }
  createJPEGStream(opts?: JpegConfig) {
    return this.getNodeCanvas().createJPEGStream(opts);
  }
  destroy(): void {
    const canvasElement = this.lowerCanvasEl;
    super.destroy();
    cleanUpJsdomNode(canvasElement);
  }
}