class Tail {
	constructor(x, y, segmentCount, segmentLength) {
		this.position = {
			x: x || 0,
			y: y || 0
		};

		segmentCount = segmentCount || 0;

		this.segments = [];

		for (var i = 0; i < segmentCount; i++) {
			this.addSegment(segmentLength);
		}

		this.setTarget(this.position);
	}

	addSegment(segmentLength, positionIndex) {
		positionIndex = typeof positionIndex == "number" ? positionIndex : 0;

		let segment = {
			pointA: {
				x: this.position.x,
				y: this.position.y
			},
			pointB: {
				x: this.position.x - this.segments.length * segmentLength,
				y: this.position.y
			},
			angle: 0,
			angleLimit: Math.PI * 2,
			length: segmentLength
		};

		this.segments.splice(positionIndex, 0, segment);
		return segment;
	}

	setSource() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];

		let firstSegment = this.segments[0];
		firstSegment.pointB.x = x;
		firstSegment.pointB.y = y;

		for (var i = 0; i < this.segments.length; i++) {
			let segment = this.segments[i];
			let nextSegment = this.segments[i + 1];
			if (nextSegment) {
				segment.angle = Math.atan2(nextSegment.pointB.y - segment.pointB.y, nextSegment.pointB.x - segment.pointB.x);
				segment.pointA.x = segment.pointB.x + Math.cos(segment.angle) * segment.length;
				segment.pointA.y = segment.pointB.y + Math.sin(segment.angle) * segment.length;
				nextSegment.pointB.x = segment.pointA.x;
				nextSegment.pointB.y = segment.pointA.y;
			}

			//Make sure the last segment doesn't stick with the target
			if (segment == this.getLastSegment()) {
				segment.pointA.x = segment.pointB.x + Math.cos(segment.angle) * segment.length;
				segment.pointA.y = segment.pointB.y + Math.sin(segment.angle) * segment.length;
			}
		}
	}

	setTarget() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		this.position.x = x;
		this.position.y = y;

		//Calculate angle for target
		let lastSegment = this.getLastSegment();
		lastSegment.angle = Math.atan2(this.position.y - lastSegment.pointB.y, this.position.x - lastSegment.pointB.x);
		lastSegment.pointA.x = this.position.x;
		lastSegment.pointA.y = this.position.y;

		//Limiting the angle
		let segmentBefore = this.segments[this.segments.indexOf(lastSegment) - 1];
		if (segmentBefore) {
			let fixedAngle = Math.atan2(Math.sin(lastSegment.angle - segmentBefore.angle), Math.cos(lastSegment.angle - segmentBefore.angle));

			if (fixedAngle > lastSegment.angleLimit) {
				lastSegment.angle -= fixedAngle - lastSegment.angleLimit;
			}

			if (fixedAngle < -lastSegment.angleLimit) {
				lastSegment.angle -= fixedAngle + lastSegment.angleLimit;
			}
		}

		//Move
		lastSegment.pointB.x = lastSegment.pointA.x - Math.cos(lastSegment.angle) * lastSegment.length;
		lastSegment.pointB.y = lastSegment.pointA.y - Math.sin(lastSegment.angle) * lastSegment.length;

		//Connect the other segments
		for (var i = this.segments.length - 1; i >= 0; i--) {
			const currentSegment = this.segments[i];
			const nextSegment = this.segments[i + 1];
			if (nextSegment) {
				//Calculate angle/position
				currentSegment.pointA.x = nextSegment.pointB.x;
				currentSegment.pointA.y = nextSegment.pointB.y;
				currentSegment.angle = Math.atan2(currentSegment.pointA.y - currentSegment.pointB.y, currentSegment.pointA.x - currentSegment.pointB.x);

				//Limiting the angle
				let fixedAngle = Math.atan2(Math.sin(currentSegment.angle - nextSegment.angle), Math.cos(currentSegment.angle - nextSegment.angle));

				if (fixedAngle > currentSegment.angleLimit) {
					currentSegment.angle -= fixedAngle - currentSegment.angleLimit;
				}

				if (fixedAngle < -currentSegment.angleLimit) {
					currentSegment.angle -= fixedAngle + currentSegment.angleLimit;
				}

				//Move
				currentSegment.pointB.x = currentSegment.pointA.x - Math.cos(currentSegment.angle) * currentSegment.length;
				currentSegment.pointB.y = currentSegment.pointA.y - Math.sin(currentSegment.angle) * currentSegment.length;
			}
		}
	}

	rotateSegment(segmentIndex, angle) {
		segmentIndex = typeof segmentIndex == "number" ? segmentIndex : 0;

		//Rotate the segment
		let segment = this.segments[segmentIndex];
		segment.angle = Math.atan2(segment.pointA.y - segment.pointB.y, segment.pointA.x - segment.pointB.x);
		segment.pointA.x = segment.pointB.x + Math.cos(angle) * segment.length;
		segment.pointA.y = segment.pointB.y + Math.sin(angle) * segment.length;

		//Connect the other segments
		for (var i = 0; i < this.segments.length; i++) {
			const currentSegment = this.segments[i];
			const prevSegment = this.segments[i - 1];
			if (currentSegment != segment) {
				if (prevSegment) {
					//Calculate angle/position
					currentSegment.pointB.x = prevSegment.pointA.x;
					currentSegment.pointB.y = prevSegment.pointA.y;
					currentSegment.angle = Math.atan2(currentSegment.pointA.y - currentSegment.pointB.y, currentSegment.pointA.x - currentSegment.pointB.x);

					//Limiting the angle
					let fixedAngle = Math.atan2(Math.sin(currentSegment.angle - prevSegment.angle), Math.cos(currentSegment.angle - prevSegment.angle));

					if (fixedAngle > currentSegment.angleLimit) {
						currentSegment.angle -= fixedAngle - currentSegment.angleLimit;
					}

					if (fixedAngle < -currentSegment.angleLimit) {
						currentSegment.angle -= fixedAngle + currentSegment.angleLimit;
					}

					//Move
					currentSegment.pointA.x = currentSegment.pointB.x + Math.cos(currentSegment.angle) * currentSegment.length;
					currentSegment.pointA.y = currentSegment.pointB.y + Math.sin(currentSegment.angle) * currentSegment.length;
				}
			}
		}
	}

	setAngleLimit(angle) {
		for (let segment of this.segments) {
			segment.angleLimit = angle;
		}
	}

	getLastSegment() {
		return this.segments[this.segments.length - 1];
	}
}

module.exports = Tail;