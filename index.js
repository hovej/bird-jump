import { Game } from './classes.js'
import { displayMenu } from './handle-menus.js'
import { versionHistory } from './versionHistory.js'

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
			difficultyLevel: difficulty,
			...configData[difficulty]
		},
		assets
	})

	displayMenu()

	// add onclick to retry button
	document.getElementById('retry').onclick = (e) => startNewGame(difficulty)

	// add player control listener
	window.onkeydown = e => (newGame.player.flap(e))
	newGame.start()
}

const loadAssets = async () => {
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
	return assets
}

displayMenu('main')
document.getElementById('versions').innerHTML = versionHistory

// add functionality for menu buttons
// main menu
document.getElementById('easy').addEventListener('click', () => startNewGame('easy'))
document.getElementById('medium').addEventListener('click', () => startNewGame('medium'))
document.getElementById('hard').addEventListener('click', () => startNewGame('hard'))
document.getElementById('extreme').addEventListener('click', () => startNewGame('extreme'))

// instructions menu
document.getElementById('howToPlay').addEventListener('click', () => displayMenu('instructions'))
document.getElementById('returnToMenu').addEventListener('click', () => displayMenu('main'))

// death menu
document.getElementById('endGame').addEventListener('click', () => displayMenu('main'))

// versions menu
document.getElementById('seeVersions').addEventListener('click', () => displayMenu('version'))