const _ids = [];
let _lengthAuto;

module.exports = {
	uid: function(length) {
		length = length || 16;
		let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let id = "";

		function generateId() {
			id = "";
			let len = _lengthAuto || length;
			for (var i = 0; i < len; i++) {
				id += chars[Math.floor(Math.random() * chars.length)];
			}
		}

		generateId();

		let start = performance.now();
		while (_ids.includes(id)) {
			if (performance.now() - start > 20) {
				_lengthAuto = !_lengthAuto ? length + 1 : _lengthAuto + 1;
			}
			generateId();
		}

		_ids.push(id);
		return id;
	},
	lerp: function(start, stop, weight) {
		return weight * (stop - start) + start;
	},
	dist: function(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	},
	map: function(n, start1, stop1, start2, stop2) {
		return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	},
	random: function() {
		if (arguments.length == 2 && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
			return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
		} else if (arguments.length == 1 && typeof arguments[0] == "number") {
			return Math.random() * arguments[0];
		} else if (Array.isArray(arguments[0])) {
			return arguments[0][Math.floor(Math.random() * arguments[0].length)];
		} else if (arguments.length > 2) {
			let args = [...arguments];
			return args[Math.floor(Math.random() * args.length)];
		}
	},
	clamp: function(n, min, max) {
		let val = n < min ? min : n;
		val = val > max ? max : val;
		return val;
	},
	getCurvePoints: function(pts, tension, isClosed, numOfSegments) {
		tension = (typeof tension != 'undefined') ? tension : 0.5;
		isClosed = isClosed ? isClosed : false;
		numOfSegments = numOfSegments ? numOfSegments : 16;

		var _pts = [],
			res = [], // clone array
			x, y, // our x,y coords
			t1x, t2x, t1y, t2y, // tension vectors
			c1, c2, c3, c4, // cardinal points
			st, t, i; // steps based on num. of segments

		for(var i = 0; i < pts.length; i++){
			_pts.push(pts[i].x, pts[i].y);
		}

		pts = _pts.slice(0);

		if (isClosed) {
			_pts.unshift(pts[pts.length - 1]);
			_pts.unshift(pts[pts.length - 2]);
			_pts.unshift(pts[pts.length - 1]);
			_pts.unshift(pts[pts.length - 2]);
			_pts.push(pts[0]);
			_pts.push(pts[1]);
		} else {
			_pts.unshift(pts[1]);
			_pts.unshift(pts[0]);
			_pts.push(pts[pts.length - 2]);
			_pts.push(pts[pts.length - 1]);
		}

		for (i = 2; i < (_pts.length - 4); i += 2) {
			for (t = 0; t <= numOfSegments; t++) {
				t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
				t2x = (_pts[i + 4] - _pts[i]) * tension;

				t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
				t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

				st = t / numOfSegments;

				c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
				c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
				c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
				c4 = Math.pow(st, 3) - Math.pow(st, 2);

				x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
				y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

				res.push(x);
				res.push(y);

			}
		}

		return res;
	},
	drawLines: function(ctx, pts) {
		for (i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
	},
	drawCurve: function(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

		showPoints = showPoints ? showPoints : false;

		this.drawLines(ctx, this.getCurvePoints(ptsa, tension, isClosed, numOfSegments));

		if (showPoints) {
			ctx.stroke();
			ctx.beginPath();
			for (var i = 0; i < ptsa.length - 1; i += 2)
				ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
		}
	}
};