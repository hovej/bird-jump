const displayMenu = (type, score) => {
	const mainMenu = document.getElementById('mainMenu')
	const instructions = document.getElementById('instructions')
	const death = document.getElementById('deathMenu')
	const version = document.getElementById('futureUpdates')

	// if type is version, just toggle menu without changing others
	if (type === 'version') {
		version.style.display = version.style.display === '' ? version.style.display = 'none' : ''
		return
	}

	mainMenu.style.display = 'none'
	instructions.style.display = 'none'
	death.style.display = 'none'
	version.style.display = 'none'

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