function addSVGcircle(x,y) {
	var container = document.getElementById("container");
	var circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
	circle.setAttribute("cx",x);
	circle.setAttribute("cy",y);
	circle.setAttribute("r",3);
	circle.setAttribute("stroke","black");
	//circle.setAttribute("fill","none");
	container.appendChild(circle);
}

function addSVGline(x1,y1,x2,y2) {
	var container = document.getElementById("container");
	var line = document.createElementNS("http://www.w3.org/2000/svg",'line');
	line.setAttribute("x1",x1);
	line.setAttribute("x2",x2);
	line.setAttribute("y1",y1);
	line.setAttribute("y2",y2);
	line.setAttribute("stroke","black");
	container.appendChild(line);
}

function setup() {
	addSVGcircle(60,60);
	addSVGcircle(70,60);
	addSVGline(60,90,60,60);
	addSVGline(60,90,70,60);
  

var zoomer = (function () {
    var img_ele = null,
      x_cursor = 0,
      y_cursor = 0,
      x_img_ele = 0,
      y_img_ele = 0,
      orig_width = document.getElementById('container').getBoundingClientRect().width,
      orig_height = document.getElementById('container').getBoundingClientRect().height,
      current_top = 0,
      current_left = 0,
      zoom_factor = 1.0;

    return {
        zoom: function (zoomincrement) {
			console.log('in zoom');
            img_ele = document.getElementById('container');
            zoom_factor = zoom_factor + zoomincrement;
            if (zoom_factor <= 1.0)
            {
                zoom_factor = 1.0;
                img_ele.style.top =  '0px';    
                img_ele.style.left = '0px';
            }
            var pre_width = img_ele.getBoundingClientRect().width, pre_height = img_ele.getBoundingClientRect().height;
            console.log('prewidth='+img_ele.getBoundingClientRect().width+'; pre_height ='+img_ele.getBoundingClientRect().height);
        //  img_ele.style.width = (pre_width * zoomincrement) + 'px';
        //  img_ele.style.height = (pre_height * zoomincrement) + 'px';
            var new_width = (orig_width * zoom_factor);
            var new_heigth = (orig_height * zoom_factor);

                console.log('postwidth='+img_ele.style.width+'; postheight ='+img_ele.style.height);

            if (current_left < (orig_width - new_width))
            {
                current_left = (orig_width - new_width);
            }
            if (current_top < (orig_height - new_heigth))
            {
                current_top = (orig_height - new_heigth);
            }
            img_ele.style.left = current_left + 'px';
            img_ele.style.top = current_top + 'px';
            img_ele.style.width = new_width + 'px';
            img_ele.style.height = new_heigth + 'px';

            img_ele = null;
        },

        start_drag: function () {
  		  console.log('in start_drag');
          if (zoom_factor <= 1.0)
          {
             return;
          }
          img_ele = this;
          x_img_ele = window.event.clientX - document.getElementById('zoom-img').offsetLeft;
          y_img_ele = window.event.clientY - document.getElementById('zoom-img').offsetTop;
          console.log('img='+img_ele.toString()+'; x_img_ele='+x_img_ele+'; y_img_ele='+y_img_ele+';')
          console.log('offLeft='+document.getElementById('zoom-img').offsetLeft+'; offTop='+document.getElementById('zoom-img').offsetTop)
        },

        stop_drag: function () {
  		  console.log('in stop_drag');
          if (img_ele !== null) {
            if (zoom_factor <= 1.0)
            {
              img_ele.style.left = '0px';
              img_ele.style.top =  '0px';      
            }
            console.log(img_ele.style.left+' - '+img_ele.style.top);
            }
          img_ele = null;
        },

        while_drag: function () {
    		  console.log('in while_drag');
            if (img_ele !== null)
            {
                var x_cursor = window.event.clientX;
                var y_cursor = window.event.clientY;
                var new_left = (x_cursor - x_img_ele);
                if (new_left > 0)
                {
                    new_left = 0;
                }
                if (new_left < (orig_width - img_ele.width))
                {
                    new_left = (orig_width - img_ele.width);
                }
                var new_top = ( y_cursor - y_img_ele);
                if (new_top > 0)
                {
                    new_top = 0;
                }
                if (new_top < (orig_height - img_ele.height))
                {
                    new_top = (orig_height - img_ele.height);
                }
                current_left = new_left;
                img_ele.style.left = new_left + 'px';
                current_top = new_top;
                img_ele.style.top = new_top + 'px';

                //console.log(img_ele.style.left+' - '+img_ele.style.top);
            }
        }
    };
} ());


  
  document.getElementById('container').addEventListener('mousedown', zoomer.start_drag);
  document.getElementById('container').addEventListener('mousemove', zoomer.while_drag);
  document.getElementById('container').addEventListener('mouseup', zoomer.stop_drag);
  document.getElementById('container').addEventListener('mouseout', zoomer.stop_drag);

  
}

// https://stackoverflow.com/questions/52576376/how-to-zoom-in-on-a-complex-svg-structure


//console.clear();

setup();

var svg = document.querySelector("#container");
var reset = document.querySelector("#reset");
var pivot = document.querySelector("#pivot");
var proxy = document.createElement("div");
var viewport = document.querySelector("#viewport");

var rotateThreshold = 4;
var reachedThreshold = false;

var point = svg.createSVGPoint();
var startClient = svg.createSVGPoint();
var startGlobal = svg.createSVGPoint();

var viewBox = svg.viewBox.baseVal;

var cachedViewBox = {
  x: viewBox.x,
  y: viewBox.y,
  width: viewBox.width,
  height: viewBox.height
};

//var zoom = {
  //animation: new TimelineLite(),
  //scaleFactor: 1.1,
  //duration: 0.5,
  //ease: Power2.easeOut,
//};

window.addEventListener("wheel", onWheel);


//
// ON WHEEL
// =========================================================================== 
function onWheel(event) {
  //event.preventDefault();
  
  var normalized;  
  var delta = event.wheelDelta;
  var scaleFactor = 1.1;
  var viewBox = svg.viewBox.baseVal;

  if (delta) {
    normalized = (delta % 120) == 0 ? delta / 120 : delta / 12;
  } else {
    delta = event.deltaY || event.detail || 0;
    normalized = -(delta % 3 ? delta * 10 : delta / 3);
  }
  
  var scaleDelta = normalized > 0 ? 1 / scaleFactor : scaleFactor;
  
  point.x = event.clientX;
  point.y = event.clientY;
 
  var startPoint = point.matrixTransform(svg.getScreenCTM().inverse());
    
  var fromVars = {
    x: viewBox.x,
    y: viewBox.y,
    width: viewBox.width,
    height: viewBox.height,
  };
  
  viewBox.x -= (startPoint.x - viewBox.x) * (scaleDelta - 1);
  viewBox.y -= (startPoint.y - viewBox.y) * (scaleDelta - 1);
  viewBox.width *= scaleDelta;
  viewBox.height *= scaleDelta;
  
  
  console.log('viewBox', viewBox.x.toFixed(2) + ' ' + viewBox.y.toFixed(2) + ' ' + viewBox.width.toFixed(2) + ' ' + viewBox.height.toFixed(2));

  if (viewBox.width > 1000) return;
  if (viewBox.height > 1000) return;
  
  svg.setAttribute('viewBox', viewBox.x + ' ' + viewBox.y + ' ' + viewBox.width + ' ' + viewBox.height);
}

//
// SELECT DRAGGABLE
// =========================================================================== 
function selectDraggable(event) {
	console.log('drag');
   
  if (resetAnimation.isActive()) {
    resetAnimation.kill();
  }
    
  startClient.x = this.pointerX;
  startClient.y = this.pointerY;
  startGlobal = startClient.matrixTransform(svg.getScreenCTM().inverse());
  
  // Right mouse button
  if (event.button === 2) {
    
    reachedThreshold = false;
    
    pannable.disable();
    
  } else {
    pannable.enable().update().startDrag(event);
  }
}

//
// UPDATE VIEWBOX
// =========================================================================== 
function updateViewBox() {
  
  if (zoom.animation.isActive()) {
    return;
  }
  
  point.x = this.x;
  point.y = this.y;
  
  var moveGlobal = point.matrixTransform(svg.getScreenCTM().inverse());
    
  viewBox.x -= (moveGlobal.x - startGlobal.x);
  viewBox.y -= (moveGlobal.y - startGlobal.y); 
}
