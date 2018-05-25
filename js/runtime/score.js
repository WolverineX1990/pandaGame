import Sprite from '../base/sprite';

const SCORE_IMG_SRC = 'images/scorefont.png';
const SCORE_WIDTH = 40;
const SCORE_HEIGTH = 40;

export default class Score extends Sprite {
  constructor() {
    super(SCORE_IMG_SRC, SCORE_WIDTH, SCORE_HEIGTH);
    this.top = 0;
  }

  drawToCanvas(ctx) {
    
  }
}