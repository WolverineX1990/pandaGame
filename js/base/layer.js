export default class Layer {
  constructor() {
    this.childrens = [];
    this.visible = true;
  }

  addChild(sprite) {
    this.childrens.push(sprite);
  }

  removeChild() {
    
  }

  render(ctx) {
    if ( !this.visible ) {
      return;
    }
    if(!ctx) {
      throw new Error('没有绘制ctx对象');
    }
    this.childrens.forEach(sprite=>{
      sprite.drawToCanvas(ctx);
    });
  }

  update() {

  }

  destory() {

  }
}