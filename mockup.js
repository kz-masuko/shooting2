enchant();

//‚¢‚ë‚¢‚ë10:44 2012/08/01
var GW = 320;
var GH = 320;
 
//自機のクラス
var Fighter = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y){
        enchant.Sprite.call(this, 40, 40);
        this.image = game.assets['fighter2.gif'];
        this.x = x; this.y = y; this.frame = 0;
        //タッチで移動
        game.rootScene.addEventListener('touchstart',
        	function(e){ fighter.x = e.x; game.touched = true; });
        game.rootScene.addEventListener('touchend',
        	function(e){ fighter.x = e.x; game.touched = false; });
        game.rootScene.addEventListener('touchmove',
        	function(e){ fighter.x = e.x; }); 
        this.addEventListener('enterframe', function(){
        //３フレームに一回撃つ
        if(game.touched && game.frame % 5 == 0){
        	var s = new PlayerShoot(this.x + 12, this.y); }
    });
        game.rootScene.addChild(this);
    }
});

//敵機のクラスそのいち
var Enemy00 = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, omega){
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['graphic.png'];
        this.x = x; this.y = y; this.frame = 3; this.time = 0;
        this.omega = omega*Math.PI / 180;
        this.direction = 0; this.moveSpeed = 3;
        //敵の動き
        this.addEventListener('enterframe', function(){
        	this.direction += this.omega;
        	this.x -= this.moveSpeed * Math.cos(this.direction) / 3;
        	this.y += 1;
            //画面外に出たら消える
            if(this.y > 320 || this.x > 320 || this.x < -this.width|| this.y < -this.height){
			this.remove();
            }else if(this.time++ % 30 == 0){
            var s = new EnemyShoot(this.x, this.y);
        }
    });
    game.rootScene.addChild(this);
    },
    remove: function(){
    game.rootScene.removeChild(this);
    delete enemies[this.key]; delete this;
    }
});
//敵そのに
var Enemy01 = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, omega){
        enchant.Sprite.call(this, 30, 30);
        this.image = game.assets['enemy.gif'];
        this.x = x; this.y = y; this.frame = 3; this.time = 0;
        this.omega = omega*Math.PI / 180;
        this.direction = 0; this.moveSpeed = 3;
        //敵の動き
        this.addEventListener('enterframe', function(){
        	this.direction += this.omega;
        	this.x -= this.moveSpeed * Math.cos(this.direction) * -1;
        	this.y += 1;
            //画面外に出たら消える
            if(this.y > 320 || this.x > 320 || this.x < -this.width|| this.y < -this.height){
			this.remove();
            }else if(this.time++ % 20 == 0){
            var s = new EnemyShoot(this.x + 10, this.y);
        }
    });
    game.rootScene.addChild(this);
    },
    remove: function(){
    game.rootScene.removeChild(this);
    delete enemies[this.key]; delete this;
    }
});


//弾のクラス
var Shoot = enchant.Class.create(enchant.Sprite,{
	initialize: function(x, y, direction){
	enchant.Sprite.call(this, 16 ,16 );
	this.image = game.assets['graphic.png'];
	this.x = x; this.y = y; this.frame = 12 ;
	this.direction = direction; this.moveSpeed = 10;
	this.addEventListener('enterframe', function(){
	this.x += this.moveSpeed * Math.cos(this.direction);
	this.y += this.moveSpeed * Math.sin(this.direction);
		if(this.y > 320 || this.x > 320 || this.x < -this.width || this.y < -this.height){
			this.remove();
		}
	});
	game.rootScene.addChild(this);
},
	remove: function(){ game.rootScene.removeChild(this); delete this;}
});

//自機の弾のクラス
var PlayerShoot = enchant.Class.create(Shoot, {
	initialize: function(x, y){
		Shoot.call(this, x, y, Math.PI * 1.5);
		
		this.addEventListener('enterframe', function(){
			//あたり判定
			for(var i in enemies){
				if(enemies[i].intersect(this)){
				//あたってたら敵を消す
				this.remove(); enemies[i].remove();
				game.score += 100;//スコア
				}
			}
		});
	}
});

//敵の弾のクラス
var EnemyShoot = enchant.Class.create(Shoot, {
	initialize: function(x, y){
		Shoot.call(this, x, y, Math.PI/ 2);
		this.addEventListener('enterframe', function (){
         this.image = game.assets['graphic.png'];
         this.frame = 13;
         this.scaleY = -1;
          //
    	   if(fighter.within(this, 8)){ //あたり判定
    	   game.life--;
    	   if(game.life<=0)
    	   	   game.end(game.score,"SCORE: " + game.score)
    	   }
    	  });
    	}
    });

//背景スプライト
var Background = enchant.Class.create(enchant.Sprite,{
	initialize: function(){
	enchant.Sprite.call(this, 320,640 );
	this.x = 0; 
	this.y = 0;
    this.image = game.assets['bg.png'];
	this.addEventListener('enterframe', function(){
		//ひたすらスクロール
	    this.y++;
	    //端まで来たら巻き戻す
	    if(this.y<=-320)this.y=0;
	    });
	game.rootScene.addChild(this);
	}
});

0
window.onload = function () {
    game = new Game(GW, GH);
    game.fps = 24; game.score = 0;
    game.touched = false;
    game.preload('fighter2.gif', 'enemy.gif', 'graphic.png','start.png','end.png','bg.png' );

    game.onload = function () {
        game.life = 6;
        //背景
        background = new Background();
        //自機
        fighter = new Fighter(140,250);
        enemies = [];
    game.rootScene.addEventListener('enterframe', function(){
        //ゲームを進行させる
        if(rand(100)<10){
        	//敵をランダムに出す
        	var x = rand(320);
        	var omega = x < 100 ? 1 : -1;
        	var enemy = new Enemy01(x, 0, omega);
        	var enemy = new Enemy00(x, 0, omega);
        	enemy.key = game.frame;
        	enemies[game.frame] = enemy;
     }
  
     //game.rootScene.backgroundColor = 'black'; 
        scoreLabel.score = game.score;
    });
     scoreLabel = new ScoreLabel(8, 8);
     
     lifeLabel = new MutableText(8, 320 - 32, game.width, "");
     lifeLabel.addEventListener('enterframe', function(){
     	 this.text = "LIFE  " +  "OOOOOO".substring(0, game.life);
     });
     
     
     game.rootScene.addChild(lifeLabel);
     game.rootScene.addChild(scoreLabel);
   }      
    game.start();
 }
