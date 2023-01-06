const displayMenu = (type, score) => {
	const mainMenu = document.getElementById('mainMenu')
	const instructions = document.getElementById('instructions')
	const death = document.getElementById('deathMenu')

	mainMenu.style.display = 'none'
	instructions.style.display = 'none'
	death.style.display = 'none'

	switch (type) {
		case 'main':
			mainMenu.style.display = ''
			break;
		case 'instructions':
			instructions.style.display = ''
			break;
		case 'death':
			death.style.display = ''
			document.getElementById('finalScore').innerHTML = `FINAL SCORE: ${score}`
			document.getElementById('score').innerHTML = ''
			break;
		default:
			break;
	}
}

export { displayMenu }