var VideoStream = (function(){
	var _video = document.getElementsByTagName("video")[0],
		_canvas = document.getElementsByTagName("canvas")[0],
		_context = _canvas.getContext("2d"),
		_controls = document.getElementById("controls"),
		_play = document.getElementById("play"),
		_pause = document.getElementById("pause"),
		_color = document.getElementById("color"),
		_flipX = document.getElementById("flipX"),
		_flipY = document.getElementById("flipY"),
		_sepiaButton = document.getElementById("sepia"),
		_redButton = document.getElementById("red"),
		_greenButton = document.getElementById("green"),
		_blueButton = document.getElementById("blue"),
		_resetColors = document.getElementById("resetColors"),
		_redColor = false,
		_greenColor = false,
		_blueColor = false,
		_greyScale = false,
		_sepia = false,
		_stillWrapper = document.getElementById("stillWrapper"),
		_createStill = document.getElementById("createStill"),
		_stillImage = document.getElementById("stillImage"),
		_downloadStill = document.getElementById("downloadStill"),
		_clearStill = document.getElementById("clearStill"),
		_copyVideoToCanvas,
		_height,
		_width,

	setupListeners = function() {
		_play.addEventListener("click", playVideo, false);
		_pause.addEventListener("click", pauseVideo, false);
		_flipX.addEventListener("click", flipVideoX, false);
		_flipY.addEventListener("click", flipVideoY, false);
		_resetColors.addEventListener("click", resetColors, false);

		_video.addEventListener("canplay", videoCanStartPlaying, false);

		_sepiaButton.addEventListener("click", function(){
			if (_sepia === false) {
				_sepia = true;

				_greyScale = false;
				_redColor = false;
				_greenColor = false;
				_blueColor = false;
			}
		}, false);

		_color.addEventListener("click", function(){
			if (_greyScale === false) {
				_greyScale = true;
				
				_sepia = false;
				_redColor = false;
				_greenColor = false;
				_blueColor = false;
			}
		}, false);

		_redButton.addEventListener("click", function(){
			if (_redColor === false) {
				_redColor = true;

				_greenColor = false;
				_blueColor = false;
				_sepia = false;
				_greyScale = false;
			}
		}, false);

		_greenButton.addEventListener("click", function(){
			if (_greenColor === false) {
				_greenColor = true;

				_redColor = false;
				_blueColor = false;
				_sepia = false;
				_greyScale = false;
			}
		}, false);

		_blueButton.addEventListener("click", function(){
			if (_blueColor === false) {
				_blueColor = true;
				
				_redColor = false;
				_greenColor = false;
				_sepia = false;
				_greyScale = false;
			}
		}, false);

		_createStill.addEventListener("click", createStillImage, false);
		_clearStill.addEventListener("click", clearStillImage, false);
	},

	playVideo = function() {
		_video.play();
	},

	pauseVideo = function() {
		_video.pause();
	},

	getHeightAndWidth = function() {
		_width = _video.offsetWidth;
		_height = _video.clientHeight;
		_canvas.style.width = _width + "px";
		_canvas.style.height = _height + "px";
		_video.style.display = "none";
		_canvas.setAttribute('width', _width);
		_canvas.setAttribute('height', _height);
		_context.translate(_width, 0);
		_context.scale(-1, 1);
	},

	copyToCanvas = function() {
		_copyVideoToCanvas = setInterval(function(){
			_context.fillRect(0, 0, _width, _height);
			_context.drawImage(_video, 0, 0, _width, _height);

			if (_greyScale) {
				toggleGrey();
			}

			if (_sepia) {
				toggleSepia();
			}

			if (_redColor) {
				toggleRed();
			}

			if (_greenColor) {
				toggleGreen();
			}

			if (_blueColor) {
				toggleBlue();
			}
		}, 33);
	},

	videoCanStartPlaying = function() {
		setTimeout(function(){
			_controls.style.display = "block";
			getHeightAndWidth();
			copyToCanvas();
		}, 500);
	},

	toggleGrey = function() {
		var imageData = _context.getImageData(0, 0, _width, _height),
			data = imageData.data;
		
		for (var i = 0; i < data.length; i += 4) {
			var bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			
			data[i] = bright;
			data[i + 1] = bright;
			data[i + 2] = bright;
		}

		_context.putImageData(imageData, 0, 0);
	},

	toggleSepia = function() {
		var imageData = _context.getImageData(0, 0, _width, _height),
			data = imageData.data;

		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];

			data[i + 1] = (r * 0.349)+(g * 0.686)+(b * 0.168);
			data[i + 2] = (r * 0.272)+(g * 0.534)+(b * 0.131);
		}

		_context.putImageData(imageData, 0, 0);
	},

	toggleRed = function() {
		var imageData = _context.getImageData(0, 0, _width, _height),
			data = imageData.data;

		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			data[i] = (r+g+b)/3;
			data[i + 1] = data[i + 2] = 0;
		}

		_context.putImageData(imageData, 0, 0);
	},

	toggleGreen = function() {
		var imageData = _context.getImageData(0, 0, _width, _height),
			data = imageData.data;

		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			data[i] = (r+g+b)/3;
			data[i] = data[i + 2] = 0;
		}

		_context.putImageData(imageData, 0, 0);
	},

	toggleBlue = function() {
		var imageData = _context.getImageData(0, 0, _width, _height),
			data = imageData.data;

		for (var i = 0; i < data.length; i += 4) {
			var r = data[i];
			var g = data[i + 1];
			var b = data[i + 2];
			data[i] = (r+g+b)/3;
			data[i + 1] = data[i] = 0;
		}

		_context.putImageData(imageData, 0, 0);
	},

	flipVideoX = function() {
		_context.translate(_width, 0);
		_context.scale(-1, 1);
	},

	flipVideoY = function() {
		_context.translate(0, _height);
		_context.scale(1, -1);
	},

	resetColors = function() {
		_greyScale = false;
		_sepia = false;
		_redColor = false;
		_greenColor = false;
		_blueColor = false;
	},

	createStillImage = function() {
		var dataURL = _canvas.toDataURL("image/jpeg");

		if (_createStill.innerHTML === "Create Still") {
			_createStill.innerHTML = "Update Still";
		}

		_downloadStill.href = dataURL;
		_downloadStill.style.display = "block";

		_stillImage.src = dataURL;
		_stillImage.style.width = (_width / 3) + "px";
		_stillImage.style.height = (_height / 3) + "px";
		_stillImage.style.display = "block";

		_stillWrapper.style.display = "block";
	},

	clearStillImage = function() {
		_createStill.innerHTML = "Create Still";
		_stillWrapper.style.display = "none";
		_downloadStill.style.display = "none";
		_downloadStill.src = "#";
		_stillImage.style.display = "none";
		_stillImage.src = "static/clear.png";
	};

	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

	if (navigator.getUserMedia) {
		navigator.getUserMedia({
				video: true,
				audio: false
			},

			function(stream) {
				setupListeners();

				var url = window.URL
				_video.src = url.createObjectURL(stream);
				_video.play();
			},

			function(error) {
				console.log("THERE WAS AN ERROR");
				console.log(error);
			}
		);
	} else {
		console.log("NOT SUPPORTED");
	}
})();