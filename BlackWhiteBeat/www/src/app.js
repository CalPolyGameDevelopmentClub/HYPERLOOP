
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    scoreText:null,
    score:0,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progassets. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            asset.CloseNormal_png,
            asset.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.scoreText = new cc.LabelTTF("x0", "Impact", 80);
        // position the label on the center of the screen
        this.scoreText.x = size.width / 2;
        this.scoreText.y = size.height/2;
        // add the label as a child to this layer
        this.addChild(this.scoreText, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new Circle();
        this.sprite.scheduleUpdate();
        this.addChild(this.sprite, 0);
        //this.addChild(new Circle(),0);
        
        
        if (cc.sys.capabilities.hasOwnProperty('touches')) {
        cc.eventManager.addListener({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesEnded: function (touches, event) {
                    var touch = touches[0];
                if (this.prevTouchId != touch.getID())
                    this.prevTouchId = touch.getID();
                else    
                    event.getCurrentTarget().processEvent(touches[0]);
            }
            }, this);
        }
        return true;
        
    },
    processEvent: function (event) {
        if(this.sprite.checkDidTouch(event.getLocation()))
        {
            this.score+=1;
            
        }
        else
        {
            this.score = 0;
        }
        this.scoreText.setString("x" + this.score, "Impact", 80);
        // position the label on the center of the screen
            this.scoreText.x = cc.winSize.width / 2;
            this.scoreText.y = cc.winSize.height/2;

        this.sprite.setSpeed(this.score);
    }
    
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var Circle = cc.Sprite.extend({
    speed:0.0,
    ctor:function(arg) {
      this._super(asset.Circle_png);
      this.attr({
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2,
            scale: 1.5,
            rotation: 180
        });
    },
    timeTick : 0,
    update: function (dt) {
            this.timeTick += dt * this.speed;
            this.x = Math.sin(this.timeTick) * cc.winSize.height*0.9/2 + cc.winSize.width / 2;
            this.y = Math.cos(this.timeTick) * cc.winSize.height * 0.9/2+ cc.winSize.height/2 ;  
        
    },
    checkDidTouch:function(touch) {
        
        var loc = touch;
        var bb = this.getBoundingBoxToWorld();
        console.log(bb.x + ' ' + bb.y  + ' ' + bb.width + ' ' + bb.height);
        console.log(touch.x + ' ' + touch.y);
        if(loc.x > bb.x && loc.x < bb.x + bb.width && loc.y > bb.y && loc.y < bb.y+bb.height){
            return true;
        }
        return false;
        
    },
    setSpeed:function(currentScore)
    {
        this.speed = Math.log(currentScore+1) / Math.log(1.5);
    }
});

