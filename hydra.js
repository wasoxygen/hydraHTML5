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
  canvas.width = 800; 
  canvas.height = 400;

  context = canvas.getContext('2d');
  
  //addCircle(120,120);
  //addLine(130,130,160,180);
  drawCircle(120,120);
  drawCircle(120,50);
  drawLine(120,120,120,50);
  drawCircle(145,54);
  drawLine(120,120,145,54);
}