/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Timeline Frame.
 * base class
 * @class
 */
ccs.Frame = ccs.Class.extend({

    _frameIndex: null,
    _tween: null,
    _timeline: null,
    _node: null,

    ctor: function(){
        this._frameIndex = 0;
        this._tween = true;
        this._timeline = null;
        this._node = null;
    },

    _emitEvent: function(){
        if (this._timeline){
            this._timeline.getActionTimeline()._emitFrameEvent(this);
        }
    },

    _cloneProperty: function(frame){
        this._frameIndex = frame.getFrameIndex();
        this._tween = frame.isTween();
    },

    /**
     * Set the frame index
     * @param {number} frameIndex
     */
    setFrameIndex: function(frameIndex){
        this._frameIndex = frameIndex;
    },

    /**
     * Get the frame index
     * @returns {null}
     */
    getFrameIndex: function(){
        return this._frameIndex;
    },

    /**
     * Set timeline
     * @param timeline
     */
    setTimeline: function(timeline){
        this._timeline = timeline;
    },

    /**
     * Get timeline
     * @param timeline
     * @returns {ccs.timeline}
     */
    getTimeline: function(timeline){
        return this._timeline;
    },

    /**
     * Set Node
     * @param {cc.Node} node
     */
    setNode: function(node){
        this._node = node;
    },

    /**
     * gets the Node
     * @return node
     */
    getNode: function(){
        return this._node;
    },

    /**
     * set tween
     * @param tween
     */
    setTween: function(tween){
        this._tween = tween;
    },

    /**
     * Gets the tween
     * @returns {boolean | null}
     */
    isTween: function(){
        return this._tween;
    },

    /**
     * the execution of the callback
     * @override
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){ // = 0
    },

    /**
     * Each frame logic
     * @override
     * @param {number} percent
     */
    apply: function(percent){
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @override
     * @return {ccs.Frame}
     */
    clone: function(){ // = 0
    }
});

/**
 * Visible frame
 * To control the display state
 * @class
 * @extend ccs.Frame
 */
ccs.VisibleFrame = ccs.Frame.extend({

    _visible: true,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._visible = true;
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setVisible(this._visible);
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.VisibleFrame}
     */
    clone: function(){
        var frame = new ccs.VisibleFrame();
        frame.setVisible(this._visible);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set display state
     * @param {Boolean} visible
     */
    setVisible: function(visible){
        this._visible = visible;
    },

    /**
     * Get the display state
     * @returns {Boolean}
     */
    isVisible: function(){
        return this._visible;
    }

});

/**
 * Create the visible frame
 *
 * @deprecated v3.0, please use new ccs.VisibleFrame() instead.
 * @returns {ccs.VisibleFrame}
 */
ccs.VisibleFrame.create = function(){
    return new ccs.VisibleFrame();
};

/**
 * Texture frame
 * @class
 * @extend ccs.Frame
 */
ccs.TextureFrame = ccs.Frame.extend({

    _sprite: null,
    _textureName: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);

        this._textureName = "";
    },

    /**
     * Set the node element to draw texture
     * @param {cc.Node} node
     */
    setNode: function(node){
        ccs.Frame.prototype.setNode.call(this, node);
        this._sprite = node;
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        if(this._sprite){
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(this._textureName);

            if(spriteFrame != null)
                this._sprite.setSpriteFrame(spriteFrame);
            else
                this._sprite.setTexture(this._textureName);
        }

    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.TextureFrame}
     */
    clone: function(){
        var frame = new ccs.TextureFrame();
        frame.setTextureName(this._textureName);
        frame._cloneProperty(this);
        return frame;
    },

    /**
     * Set the texture name
     * @param {string} textureName
     */
    setTextureName: function(textureName){
        this._textureName = textureName;
    },

    /**
     * Gets the Texture name
     * @returns {null}
     */
    getTextureName: function(){
        return this._textureName;
    }

});

/**
 * Create the Texture frame
 *
 * @deprecated v3.0, please use new ccs.TextureFrame() instead.
 * @returns {ccs.TextureFrame}
 */
ccs.TextureFrame.create = function(){
    return new ccs.TextureFrame();
};

/**
 * Rotation Frame
 * @class
 * @extend ccs.Frame
 */
ccs.RotationFrame = ccs.Frame.extend({

    _rotation: null,
    _betwennRotation: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._rotation = 0;
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setRotation(this._rotation);

        if(this._tween){
            this._betwennRotation = nextFrame._rotation - this._rotation;
        }
    },

    /**
     * Each frame logic
     * @param {number} percent
     */
    apply: function(percent){
        if (this._tween && this._betwennRotation != 0){
            var rotation = this._rotation + percent * this._betwennRotation;
            this._node.setRotation(rotation);
        }
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.RotationFrame}
     */
    clone: function(){
        var frame = new ccs.RotationFrame();
        frame.setRotation(this._rotation);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the rotation
     * @param {Number} rotation
     */
    setRotation: function(rotation){
        this._rotation = rotation;
    },

    /**
     * Gets the rotation
     * @returns {Number}
     */
    getRotation: function(){
        return this._rotation;
    }

});

/**
 * Create the Rotation frame
 *
 * @deprecated v3.0, please use new ccs.RotationFrame() instead.
 * @returns {ccs.RotationFrame}
 */
ccs.RotationFrame.create = function(){
    return new ccs.RotationFrame();
};

/**
 * Skew frame
 * @class
 * @extend ccs.Frame
 */
ccs.SkewFrame = ccs.Frame.extend({

    _skewX: null,
    _skewY: null,
    _betweenSkewX: null,
    _betweenSkewY: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._skewX = 0;
        this._skewY = 0;
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setSkewX(this._skewX);
        this._node.setSkewY(this._skewY);

        if(this._tween){
            this._betweenSkewX = nextFrame._skewX - this._skewX;
            this._betweenSkewY = nextFrame._skewY - this._skewY;
        }

    },

    /**
     * Each frame logic
     * @param {number} percent
     */
    apply: function(percent){
        if (this._tween && (this._betweenSkewX != 0 || this._betweenSkewY != 0))
        {
            var skewx = this._skewX + percent * this._betweenSkewX;
            var skewy = this._skewY + percent * this._betweenSkewY;

            this._node.setSkewX(skewx);
            this._node.setSkewY(skewy);
        }
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.SkewFrame}
     */
    clone: function(){
        var frame = new ccs.SkewFrame();
        frame.setSkewX(this._skewX);
        frame.setSkewY(this._skewY);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the skew x
     * @param {Number} skewx
     */
    setSkewX: function(skewx){
        this._skewX = skewx;
    },

    /**
     * Gets the skew x
     * @returns {Number}
     */
    getSkewX: function(){
        return this._skewX;
    },

    /**
     * Set the skew y
     * @param {Number} skewy
     */
    setSkewY: function(skewy){
        this._skewY = skewy;
    },

    /**
     * Gets the skew y
     * @returns {Number}
     */
    getSkewY: function(){
        return this._skewY;
    }

});

/**
 * Create the Skew frame
 *
 * @deprecated v3.0, please use new ccs.SkewFrame() instead.
 * @returns {ccs.SkewFrame}
 */
ccs.SkewFrame.create = function(){
    return new ccs.SkewFrame();
};

/**
 * Rotation skew frame
 * @class
 * @extend ccs.SkewFrame
 */
ccs.RotationSkewFrame = ccs.SkewFrame.extend({

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){

        this._node.setRotationX(this._skewX);
        this._node.setRotationY(this._skewY);

        if (this._tween)
        {
            this._betweenSkewX = nextFrame._skewX - this._skewX;
            this._betweenSkewY = nextFrame._skewY - this._skewY;
        }

    },

    /**
     * Each frame logic
     * @param {number} percent
     */
    apply: function(percent){
        if (this._tween && (this._betweenSkewX != 0 || this._betweenSkewY != 0)){
            var skewx = this._skewX + percent * this._betweenSkewX;
            var skewy = this._skewY + percent * this._betweenSkewY;

            this._node.setRotationX(skewx);
            this._node.setRotationY(skewy);
        }

    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.RotationSkewFrame}
     */
    clone: function(){
        var frame = new ccs.RotationSkewFrame();
        frame.setSkewX(this._skewX);
        frame.setSkewY(this._skewY);

        frame._cloneProperty(this);

        return frame;

    }

});

/**
 * Create the RotationSkew frame
 *
 * @deprecated v3.0, please use new ccs.RotationSkewFrame() instead.
 * @returns {ccs.RotationSkewFrame}
 */
ccs.RotationSkewFrame.create = function(){
    return new ccs.RotationSkewFrame();
};

/**
 * Position frame
 * @class
 * @extend ccs.Frame
 */
ccs.PositionFrame = ccs.Frame.extend({

    _position: null,
    _betweenX: null,
    _betweenY: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._position = cc.p(0, 0);
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setPosition(this._position);

        if(this._tween){
            this._betweenX = nextFrame._position.x - this._position.x;
            this._betweenY = nextFrame._position.y - this._position.y;
        }
    },

    /**
     * Each frame logic
     * @param {number} percent
     */
    apply: function(percent){
        if (this._tween && (this._betweenX != 0 || this._betweenY != 0)){
            var p = cc.p(0, 0);
            p.x = this._position.x + this._betweenX * percent;
            p.y = this._position.y + this._betweenY * percent;

            this._node.setPosition(p);
        }
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.PositionFrame}
     */
    clone: function(){
        var frame = new ccs.PositionFrame();
        frame.setPosition(this._position);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the position
     * @param {cc.p} position
     */
    setPosition: function(position){
        this._position = position;
    },

    /**
     * gets the position
     * @returns {cc.p}
     */
    getPosition: function(){
        return this._position;
    },

    /**
     * Set the position x
     * @param {Number} x
     */
    setX: function(x){
        this._position.x = x;
    },

    /**
     * Gets the postion x
     * @returns {Number}
     */
    getX: function(){
        return this._position.x;
    },

    /**
     * Set the position y
     * @param {Number} y
     */
    setY: function(y){
        this._position.y = y;
    },

    /**
     * Gets the position y
     * @returns {Number}
     */
    getY: function(){
        return this._position.y;
    }

});

/**
 * Create the Position frame
 *
 * @deprecated v3.0, please use new ccs.PositionFrame() instead.
 * @returns {ccs.PositionFrame}
 */
ccs.PositionFrame.create = function(){
    return new ccs.PositionFrame();
};

/**
 * Scale frame
 * @class
 * @xtend ccs.Frame
 */
ccs.ScaleFrame = ccs.Frame.extend({

    _scaleX: null,
    _scaleY: null,
    _betweenScaleX: null,
    _betweenScaleY: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._scaleX = 1;
        this._scaleY = 1;
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setScaleX(this._scaleX);
        this._node.setScaleY(this._scaleY);

        if(this._tween){
            this._betweenScaleX = nextFrame._scaleX - this._scaleX;
            this._betweenScaleY = nextFrame._scaleY - this._scaleY;
        }

    },

    /**
     * Each frame logic
     * @param {number} percent
     */
    apply: function(percent){
        if (this._tween && (this._betweenScaleX != 0 || this._betweenScaleY != 0)){
            var scaleX = this._scaleX + this._betweenScaleX * percent;
            var scaleY = this._scaleY + this._betweenScaleY * percent;

            this._node.setScaleX(scaleX);
            this._node.setScaleY(scaleY);
        }
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.ScaleFrame}
     */
    clone: function(){
        var frame = new ccs.ScaleFrame();
        frame.setScaleX(this._scaleX);
        frame.setScaleY(this._scaleY);

        frame._cloneProperty(this);

        return frame;

    },

    /**
     * Set the scale
     * @param {Number} scale
     */
    setScale: function(scale){
        this._scaleX = scale;
        this._scaleY = scale;
    },

    /**
     * Set the scale x
     * @param {Number} scaleX
     */
    setScaleX: function(scaleX){
        this._scaleX = scaleX;
    },

    /**
     * Gets the scale x
     * @returns {Number}
     */
    getScaleX: function(){
        return this._scaleX;
    },

    /**
     * Set the scale y
     * @param {Number} scaleY
     */
    setScaleY: function(scaleY){
        this._scaleY = scaleY;
    },

    /**
     * Gets the scale y
     * @returns {Number}
     */
    getScaleY: function(){
        return this._scaleY;
    }

});

/**
 * Create the Scale frame
 *
 * @deprecated v3.0, please use new ccs.ScaleFrame() instead.
 * @returns {ccs.ScaleFrame}
 */
ccs.ScaleFrame.create = function(){
    return new ccs.ScaleFrame();
};

/**
 * AnchorPoint frame
 * @class
 * @extend ccs.Frame
 */
ccs.AnchorPointFrame = ccs.Frame.extend({

    _anchorPoint: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._anchorPoint = cc.p(0, 0);
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setAnchorPoint(this._anchorPoint);
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.AnchorPointFrame}
     */
    clone: function(){
        var frame = new ccs.AnchorPointFrame();
        frame.setAnchorPoint(this._anchorPoint);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the anchor point
     * @param {cc.p} point
     */
    setAnchorPoint: function(point){
        this._anchorPoint = point;
    },

    /**
     * Gets the anchor point
     * @returns {cc.p}
     */
    getAnchorPoint: function(){
        return this._anchorPoint;
    }

});

/**
 * Create the AnchorPoint frame
 *
 * @deprecated v3.0, please use new ccs.AnchorPointFrame() instead.
 * @returns {ccs.AnchorPointFrame}
 */
ccs.AnchorPointFrame.create = function(){
    return new ccs.AnchorPointFrame();
};

/**
 * Static param
 * @namespace
 */
ccs.InnerActionType = {
    LoopAction : 0,
    NoLoopAction : 1,
    SingleFrame : 2
};

/**
 * Inner action frame
 * @class
 * @extend ccs.Frame
 */
ccs.InnerActionFrame = ccs.Frame.extend({

    _innerActionType: null,
    _startFrameIndex: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);

        this._innerActionType = ccs.InnerActionType.LoopAction;
        this._startFrameIndex = 0;
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        //override
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.InnerActionFrame}
     */
    clone: function(){
        var frame = new ccs.InnerActionFrame();
        frame.setInnerActionType(this._innerActionType);
        frame.setStartFrameIndex(this._startFrameIndex);

        frame._cloneProperty(this);

        return frame;

    },

    /**
     * Set the inner action type
     * @param {ccs.InnerActionType} type
     */
    setInnerActionType: function(type){
        this._innerActionType = type;
    },

    /**
     * Gets the inner action type
     * @returns {ccs.InnerActionType}
     */
    getInnerActionType: function(){
        return this._innerActionType;
    },

    /**
     * Set the start frame index
     * @param {Number} frameIndex
     */
    setStartFrameIndex: function(frameIndex){
        this._startFrameIndex = frameIndex;
    },

    /**
     * Get the start frame index
     * @returns {Number}
     */
    getStartFrameIndex: function(){
        return this._startFrameIndex;
    }

});

/**
 * Create the InnerAction frame
 *
 * @deprecated v3.0, please use new ccs.InnerActionFrame() instead.
 * @returns {ccs.InnerActionFrame}
 */
ccs.InnerActionFrame.create = function(){
    return new ccs.InnerActionFrame();
};

/**
 * Color frame
 * @class
 * @extend ccs.Frame
 */
ccs.ColorFrame = ccs.Frame.extend({

    _alpha: null,
    _color: null,

    _betweenAlpha: null,
    _betweenRed: null,
    _betweenGreen: null,
    _betweenBlue: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);

        this._alpha = 255;
        this.color = cc.color(255, 255, 255);
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._node.setOpacity(this._alpha);
        this._node.setColor(this._color);

        if(this._tween){
            this._betweenAlpha = nextFrame._alpha - this._alpha;

            var color = nextFrame._color;
            this._betweenRed   = color.r - this._color.r;
            this._betweenGreen = color.g - this._color.g;
            this._betweenBlue  = color.b - this._color.b;
        }

    },

    /**
     * Each frame logic
     * @param {number} percent
     */
    apply: function(percent){
        if (this._tween && (this._betweenAlpha !=0 || this._betweenRed != 0 || this._betweenGreen != 0 || this._betweenBlue != 0)){
            var alpha = this._alpha + this._betweenAlpha * percent;

            var color = cc.color(255, 255, 255);
            color.r = this._color.r + this._betweenRed   * percent;
            color.g = this._color.g + this._betweenGreen * percent;
            color.b = this._color.b + this._betweenBlue  * percent;

            this._node.setOpacity(alpha);
            this._node.setColor(color);
        }
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.ColorFrame}
     */
    clone: function(){
        var frame = new ccs.ColorFrame();
        frame.setAlpha(this._alpha);
        frame.setColor(this._color);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the alpha
     * @param {Number} alpha
     */
    setAlpha: function(alpha){
        this._alpha = alpha;
    },

    /**
     * Gets the alpha
     * @returns {Number}
     */
    getAlpha: function(){
        return this._alpha;
    },

    /**
     * Set the color
     * @param {cc.color} color
     */
    setColor: function(color){
        this._color = color;
    },

    /**
     * Gets the color
     * @returns {cc.color}
     */
    getColor: function(){
        return this._color;
    }

});

/**
 * Create the Color frame
 *
 * @deprecated v3.0, please use new ccs.ColorFrame() instead.
 * @returns {ccs.ColorFrame}
 */
ccs.ColorFrame.create = function(){
    return new ccs.ColorFrame();
};

/**
 * Event frame
 * @class
 * @extend ccs.Frame
 */
ccs.EventFrame = ccs.Frame.extend({

    _event: null,

    ctor: function(){
        ccs.Frame.prototype.ctor.call(this);
        this._event = "";
    },

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        this._emitEvent();
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.EventFrame}
     */
    clone: function(){
        var frame = new ccs.EventFrame();
        frame.setEvent(this._event);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the event
     * @param event
     */
    setEvent: function(event){
        this._event = event;
    },

    /**
     * Gets the event
     * @returns {null}
     */
    getEvent: function(){
        return this._event;
    }

});

/**
 * Create the Event frame
 *
 * @deprecated v3.0, please use new ccs.EventFrame() instead.
 * @returns {ccs.EventFrame}
 */
ccs.EventFrame.create = function(){
    return new ccs.EventFrame();
};

/**
 * zOrder frame
 * @class
 * @extend ccs.Frame
 */
ccs.ZOrderFrame = ccs.Frame.extend({

    _zorder: null,

    /**
     * the execution of the callback
     * @param {ccs.Frame} nextFrame
     */
    onEnter: function(nextFrame){
        if(this._node)
            this._node.setLocalZOrder(this._zorder);
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
     * @return {ccs.ZOrderFrame}
     */
    clone: function(){
        var frame = new ccs.ZOrderFrame();
        frame.setZOrder(this._zorder);

        frame._cloneProperty(this);

        return frame;
    },

    /**
     * Set the zOrder
     * @param {Number} zorder
     */
    setZOrder: function(zorder){
        this._zorder = zorder;
    },

    /**
     * Gets the zOrder
     * @returns {Number}
     */
    getZOrder: function(){
        return this._zorder;
    }

});

/**
 * Create the ZOrder frame
 *
 * @deprecated v3.0, please use new ccs.ZOrderFrame() instead.
 * @returns {ccs.ZOrderFrame}
 */
ccs.ZOrderFrame.create = function(){
    return new ccs.ZOrderFrame();
};