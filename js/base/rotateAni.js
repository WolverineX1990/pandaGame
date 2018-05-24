import Sprite  from './sprite';

export default class RotateAni extends Sprite {
  constructor(imgSrc = '', width =  0, height = 0, x = 0, y = 0, increment = 1) {
    super(imgSrc, width, height, -width/2, -height/2);
    this.rotate = 0;
    this._x = x;
    this._y = y;
    this.increment = increment;
  }

  drawToCanvas(ctx) {
    ctx.save();
    ctx.translate(this._x + this.width / 2, this._y + this.height / 2);
    ctx.rotate(Math.PI / 180 * this.rotate);
    this.rotate = (this.rotate + this.increment)%360;
    super.drawToCanvas(ctx);
    ctx.restore();
  }
}
