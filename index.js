import { Game } from './classes.js'
import { displayMenu } from './handle-menus.js'

// setup and start new game
const startNewGame = async difficulty => {
	const assets = await loadAssets()
	const configData = await fetch('./config.json').then(d => d.json())
	const gameCanvas = document.getElementById('game')
	const newGame = new Game({
		canvas: gameCanvas,
		gravity: configData.physics.gravity,
		maxSpeed: configData.physics.maxSpeed,
		startingY: configData.startingY,
		difficulty: {
			...configData[difficulty]
		},
		assets
	})

	displayMenu()

	// add player control listener
	window.addEventListener('keydown', e => (newGame.player.flap(e)))
	newGame.start()
}

const loadAssets = async () => {
	console.log('loading assets...')
	const assets = {}
	const downFlap = new Image()
	downFlap.src = './assets/bluebird-downflap.png'
	await downFlap.decode()

	const midFlap = new Image()
	midFlap.src = './assets/bluebird-midflap.png'
	await midFlap.decode()

	const upFlap = new Image()
	upFlap.src = './assets/bluebird-upflap.png'
	await upFlap.decode()

	assets.bird = [midFlap, downFlap, midFlap, upFlap]
	console.log('loading complete')
	return assets
}

// const assets = await loadAssets()
// console.log('assets:', assets)

displayMenu('main')

// add functionality for menu buttons
// main menu
document.getElementById('easy').addEventListener('click', () => startNewGame('easy'))
document.getElementById('medium').addEventListener('click', () => startNewGame('medium'))
document.getElementById('hard').addEventListener('click', () => startNewGame('hard'))

// instructions menu
document.getElementById('howToPlay').addEventListener('click', () => displayMenu('instructions'))
document.getElementById('returnToMenu').addEventListener('click', () => displayMenu('main'))

// death menu
document.getElementById('endGame').addEventListener('click', () => displayMenu('main'))