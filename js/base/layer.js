export default class Layer {
  constructor() {
    this.childrens = [];
  }

  addChild(sprite) {
    this.childrens.push(sprite);
  }

  removeChild() {
    
  }

  render(ctx) {
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