/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width=  0, height = 0, x = 0, y = 0) {
    this.img     = new Image();
    this.img.src = imgSrc;

    this.width  = width;
    this.height = height;

    this.x = x;
    this.y = y;
    this.funcs = [];

    this.visible = true;
  }

  update(imgSrc, width, height, x, y) {
    if(imgSrc) {
      this.img.src = imgSrc;
    }
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible )
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  /**
   * 当手指触摸屏幕的时候
   * 判断手指是否在飞机上
   * @param {Number} x: 手指的X轴坐标
   * @param {Number} y: 手指的Y轴坐标
   * @return {Boolean}: 用于标识手指是否内部
   */
  checkIsInSide(x, y) {
    const deviation = 30

    return !!(   x >= this.x
              && y >= this.y
              && x <= this.x + this.width
              && y <= this.y + this.height);
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵的中心点处于本精灵所在的矩形内即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX = sp.x + sp.width / 2
    let spY = sp.y + sp.height / 2

    if ( !this.visible || !sp.visible )
      return false

    return !!(   spX >= this.x
              && spX <= this.x + this.width
              && spY >= this.y
              && spY <= this.y + this.height  )
  }

  addeventListener(type, func) {
    document.addEventListener(type, (e)=>{
      let point = e.touches[0];
      if(this.checkIsInSide(point.clientX, point.clientY)) {
        func();
      }
    });
  }
}
