function addCircle(x,y) {
		var newDiv = document.createElement('div');
		newDiv.style = 'top: ' + y + 'px; left: ' + x + 'px';
		newDiv.className = 'circle';
		window.document.body.appendChild(newDiv);
}

function addLine(x1,x2,y1,y2) {
	var newLine = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	newLine.setAttribute('style','position: absolute; top: ' + y1 + 'px; left: ' + x1 + 'px');
	newLine.setAttribute('class','line');
	window.document.body.appendChild(newLine);
}

function drawCircle(x1,x2) {
	var canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
    context.beginPath();
    context.arc(x1, x2, 10, 0, 2 * Math.PI, false);
    context.fillStyle = 'blue';
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#003300';
    context.stroke();	
}

function drawLine(x1,y1,x2,y2) {
	var canvas = document.getElementsByTagName('canvas')[0];
	context = canvas.getContext('2d');
    context.beginPath();
	context.strokeStyle = 'blue';
    context.moveTo(x1, y1);	
    context.lineTo(x2, y2);
	context.closePath();
	context.stroke();
}

function setup() {
  var canvas = document.getElementsByTagName('canvas')[0];
  //canvas.width = 800; 
  //canvas.height = 400;

  context = canvas.getContext('2d');
  
  //addCircle(120,120);
  //addLine(130,130,160,180);
  //drawCircle(120,120);
  //drawCircle(120,50);
  //drawLine(120,120,120,50);
  //drawCircle(145,54);
  //drawLine(120,120,145,54);
}

// https://stackoverflow.com/questions/52576376/how-to-zoom-in-on-a-complex-svg-structure




// canvas zoom thanks to Gavin Kistner
// http://phrogz.net/tmp/canvas_zoom_to_cursor.html  
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth - 20; 
canvas.height = window.innerHeight - 20;
window.onload = function(){		
	var ctx = canvas.getContext('2d');
	trackTransforms(ctx);
	function redraw(){
		// Clear the entire canvas
		var p1 = ctx.transformedPoint(0,0);
		var p2 = ctx.transformedPoint(canvas.width,canvas.height);
		ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

		// Alternatively:
		// ctx.save();
		// ctx.setTransform(1,0,0,1,0,0);
		// ctx.clearRect(0,0,canvas.width,canvas.height);
		// ctx.restore();
		
		midx = canvas.width / 2;
		midy = canvas.height / 2;

		drawLine(midx,midy,midx,midy - 70);
		drawLine(midx,midy,midx + 24, midy - 70);

		//drawCircle(midx,midy);
		drawCircle(midx,midy - 70);
		drawCircle(midx + 24, midy - 70);

		ctx.save();
		ctx.restore();
	}

	redraw();
		
	var lastX=canvas.width/2, lastY=canvas.height/2;
	var dragStart,dragged;
	canvas.addEventListener('mousedown',function(evt){
		document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragStart = ctx.transformedPoint(lastX,lastY);
		dragged = false;
	},false);
	canvas.addEventListener('mousemove',function(evt){
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragged = true;
		if (dragStart){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			redraw();
		}
	},false);
	canvas.addEventListener('mouseup',function(evt){
		dragStart = null;
		if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
	},false);

	var scaleFactor = 1.03;
	var zoom = function(clicks){
		var pt = ctx.transformedPoint(lastX,lastY);
		ctx.translate(pt.x,pt.y);
		var factor = Math.pow(scaleFactor,clicks);
		ctx.scale(factor,factor);
		ctx.translate(-pt.x,-pt.y);
		redraw();
	}

	var handleScroll = function(evt){
		var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
		if (delta) zoom(delta);
		return evt.preventDefault() && false;
	};
	canvas.addEventListener('DOMMouseScroll',handleScroll,false);
	canvas.addEventListener('mousewheel',handleScroll,false);
};

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx){
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function(){ return xform; };
	
	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function(){
		savedTransforms.push(xform.translate(0,0));
		return save.call(ctx);
	};
	var restore = ctx.restore;
	ctx.restore = function(){
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};
	var scale = ctx.scale;
	ctx.scale = function(sx,sy){
		xform = xform.scaleNonUniform(sx,sy);
		return scale.call(ctx,sx,sy);
	};
	var rotate = ctx.rotate;
	ctx.rotate = function(radians){
		xform = xform.rotate(radians*180/Math.PI);
		return rotate.call(ctx,radians);
	};
	var translate = ctx.translate;
	ctx.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx,dx,dy);
	};
	var transform = ctx.transform;
	ctx.transform = function(a,b,c,d,e,f){
		var m2 = svg.createSVGMatrix();
		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
		xform = xform.multiply(m2);
		return transform.call(ctx,a,b,c,d,e,f);
	};
	var setTransform = ctx.setTransform;
	ctx.setTransform = function(a,b,c,d,e,f){
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx,a,b,c,d,e,f);
	};
	var pt  = svg.createSVGPoint();
	ctx.transformedPoint = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}