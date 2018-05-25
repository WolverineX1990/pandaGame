import Player from './player/index';
import Enemy from './npc/enemy';
import BackGround from './runtime/background';
import GameInfo from './runtime/gameinfo';
import Music from './runtime/music';
import DataBus from './databus';
import Sprite from './base/sprite';
import RotateAni from './base/rotateAni';
import Layer from './base/layer';

let ctx = canvas.getContext('2d');
let databus = new DataBus();
const screenWidth    = window.innerWidth;
const screenHeight   = window.innerHeight;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.initGameUI();
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  initGameUI() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.bgLayer = new Layer();
    var bg = new BackGround(ctx);
    this.bgLayer.addChild(bg);
    //背景音乐
    let bgBtn = new Sprite('images/btnmelody-sheet0.png', 50, 50, 30, screenHeight - 80);
    let bgMusicPlay = true;
    bgBtn.addeventListener('touchstart', () => {
      if(bgMusicPlay) {
        bgBtn.update('images/btnmelody-sheet1.png');
      } else {
        bgBtn.update('images/btnmelody-sheet0.png');
      }
      bgMusicPlay = !bgMusicPlay;
    });
    this.bgLayer.addChild(bgBtn);

    //音乐
    let musicBtn = new Sprite('images/btnsound-sheet0.png', 50, 50, screenWidth - 80, screenHeight - 80);
    let musicPlay = true;
    musicBtn.addeventListener('touchstart', () => {
      if(musicPlay) {
        musicBtn.update('images/btnsound-sheet1.png');
      } else {
        musicBtn.update('images/btnsound-sheet0.png');
      }
      musicPlay = !musicPlay;
    });
    this.bgLayer.addChild(musicBtn);

    this.startLayer = new Layer();
    let sun = new RotateAni('images/sunlogo.png', 300, 300, screenWidth/2 - 150 , 40, 1.5);
    this.startLayer.addChild(sun);
    let logo = new Sprite('images/gamelogo.png', 256, 192, screenWidth/2 - 128 , 90);
    this.startLayer.addChild(logo);
    let startBtn = new Sprite('images/btnplay-sheet0.png', 60, 60, screenWidth/2 - 30, screenHeight - 120);
    startBtn.addeventListener('touchstart', () => {
      this.startLayer.visible = false;
      this.scoreLayer.visible = true;
    });
    this.startLayer.addChild(startBtn);

    this.scoreLayer = new Layer();
    this.scoreLayer.visible = false;
    let sun1 = new RotateAni('images/sunscore-sheet0.png', 150, 150, screenWidth/2 - 75 , 40, 1);
    this.scoreLayer.addChild(sun1);

    // this.music = new Music();
    this.bindLoop = this.loop.bind(this);
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    // this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    // this.music = new Music()

    // this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % 30 === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy)) {
        databus.gameOver = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (x >= area.startX
      && x <= area.endX
      && y >= area.startY
      && y <= area.endY)
      this.restart()
  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // this.bg.render(ctx);

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })
    
    if(this.player) {
      this.player.drawToCanvas(ctx); 
    }

    this.bgLayer.render(ctx);
    this.startLayer.render(ctx);
    this.scoreLayer.render(ctx);

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    if(this.gameinfo) {
      this.gameinfo.renderGameScore(ctx, databus.score);
    }

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      if (!this.hasEventBind) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  updateGame() {
    if (databus.gameOver)
      return;

    // this.bg.update();

    databus.bullets
      .concat(databus.enemys)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % 20 === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  updateStage() {
    // this.bg.update();
    this.startLayer.update();
    this.bgLayer.update();
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++; 
    if(databus.gameState == 'ready') {
      this.updateStage();
    } else {
      this.updateGame();
    }
    
    this.render();

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}
