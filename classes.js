import { displayMenu } from './handle-menus.js'

class Game {
	constructor(data) {
		this.canvas = data.canvas
		this.ctx = data.canvas.getContext('2d')
		this.assets = data.assets
		this.player = new Bird({y: data.startingY, canvas: this.canvas, ctx: this.ctx, maxSpeed: data.maxSpeed, assets: this.assets.bird})
		this.currentScore = 0
		this.obstacles = [],
		this.gravity = data.gravity
		this.timeSinceLastPipe = 0,
		this.pipeFrequency = data.difficulty.frequency
		this.gameSpeed = data.difficulty.gameSpeed
		this.pipeSettings = {
			yMin: data.difficulty.yMin,
			yMax: data.difficulty.yMax,
			gapMin: data.difficulty.gapMin,
			gapMax: data.difficulty.gapMax
		}
		this.lastTime = 0
		this.fps = 0
		this.gameTime = 0
	}

	score = () => {
		this.currentScore++
		document.getElementById('score').innerHTML = `SCORE: ${this.currentScore}`
	}

	generatePipe = () => {
		const x = this.canvas.width

		const y = this.pipeSettings.yMin + Math.floor(Math.random() * (this.pipeSettings.yMax - this.pipeSettings.yMin))

		const gap = this.pipeSettings.gapMin + Math.floor(Math.random() * (this.pipeSettings.gapMax - this.pipeSettings.gapMin))

		this.obstacles.push(new Pipe(x, y, gap, this.gameSpeed, this.ctx, this.canvas, this.removePipe, this.score))
	}

	removePipe = () => {
		this.obstacles = this.obstacles.slice(1, this.obstacles.length)
	}

	start = () => {
		this.run()
	}

	run = () => {
		this.update()
		this.render()
		if (this.player.alive) {
			window.requestAnimationFrame(this.run)
		} else {
			displayMenu('death', this.currentScore)
		}
	}

	update = () => {
		// refresh fps counter every second
		this.gameTime += 1
		if (this.gameTime % 60 === 0) {
			const newTime = performance.now()
			this.fps = Math.floor((newTime - this.lastTime) / (1000 / 60))
			this.lastTime = newTime
		}

		// generate a pipe every this.pipeFrequency frames
		this.timeSinceLastPipe === this.pipeFrequency ? this.timeSinceLastPipe = 0 : this.timeSinceLastPipe++
		if (this.timeSinceLastPipe === 0) this.generatePipe()

		// update player
		this.player.update(this.gravity)

		// update obstacles
		this.obstacles.forEach(pipe => pipe.update())

		// check player collisions with pipes
		let hitPipe = this.obstacles.length > 0 ? this.checkCollision() : false
		if (hitPipe) {
			this.player.alive = false
		}
	}

	checkCollision = () => {
		for (let i=0; i<this.obstacles.length; i++) {
			if (this.player.checkCollision(this.obstacles[i])) return true
		}
		return false
	}

	render = () => {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
		this.ctx.fillText(`FPS: ${this.fps}`, this.canvas.width - 50, 20)
		this.player.render()
		this.obstacles.forEach(pipe => pipe.render())
	}
}

class Bird {
	constructor(data) {
		this.canvas = data.canvas
		this.ctx = data.ctx
		this.sprites = data.assets
		this.spriteInterval = 0
		this.currentSprite = 0
		this.alive = true,
		this.x = 200
		this.y = data.y
		this.speed = 0
		this.maxSpeed = data.maxSpeed
		this.size = 13
	}

	flap = (e) => {
		if (e.keyCode !== 32) return
		this.speed = -3
	}

	update = (gravity) => {
		this.y += this.speed
		if (this.y > this.canvas.height) {
			this.alive = false
		}
		this.speed += (gravity / 60)

		// handle sprite changes
		if (this.spriteInterval >= 20 / this.sprites.length) { // full rotation per 30 frames
			this.spriteInterval = 0
			this.currentSprite = this.currentSprite === this.sprites.length - 1 ? 0 : this.currentSprite + 1
		} else {
			this.spriteInterval++
		}
	}

	checkCollision = pipe => {
		// check more left than pipe
		if (this.x + this.size < pipe.x) return false
		// check farther right than pipe
		if (this.x - this.size > pipe.x + pipe.width) return false
		// check between top and bottom pipes
		if (this.y + this.size < pipe.y && this.y - this.size > pipe.y - pipe.gap) return false
		return true
	}

	render = () => {
		this.ctx.drawImage(this.sprites[this.currentSprite], this.x - this.size, this.y - this.size)

		// Uncomment lines below to show hitbox
		// this.ctx.beginPath()
		// this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI)
		// this.ctx.stroke()
	}
}

class Pipe {
	constructor(x, y, gap, speed, ctx, canvas, removePipe, score) {
		this.x = x
		this.y = y
		this.width = 60
		this.gap = gap
		this.speed = speed
		this.ctx = ctx
		this.canvas = canvas
		this.alreadyScored = false
		this.removePipe = removePipe
		this.addScore = score
	}

	checkScored = () => {
		if (this.alreadyScored) return
		if (this.x + this.width < 200 - 15) { // bird starting x - size
			this.addScore()
			this.alreadyScored = true
		}
	}

	update = () => {
		this.x -= this.speed
		if (this.x + this.width <= 0) this.removePipe()
		this.checkScored()
	}

	render = () => {
		// draw bottom
		this.ctx.fillRect(this.x, this.y, this.width, this.canvas.height)

		// draw top
		this.ctx.fillRect(this.x, 0, this.width, this.y - this.gap)
	}
}

export {Game}