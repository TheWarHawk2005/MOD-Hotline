const themes = new Object()
themes.dark = ['2C3639', '3F4E4F', 'A27B5C', 'DCD7C9']
themes.jungle = ['483838', '42855B', '90B77D', 'D2D79F']
themes.laetare = ['1F1D36', '3F3351', '864879', 'E9A6A6']
themes.brimstone = ['211717', 'A34A28', 'F58B54', 'DFDDC7']

const applyTheme = function (theme) {
	if (!JSON.stringify(themes).includes(theme)) { //ensure valid theme and cookies
		theme = 'dark'
		setCookie('theme', 'dark', 3650)
	}
	console.log(themes[theme])
	var all = document.querySelectorAll('body')
	all.forEach(all => {
		all.style.backgroundColor = '#' + themes[theme][0]
		all.style.borderColor = '#' + themes[theme][1]
		all.style.color = '#' + themes[theme][3]
		ruleForScroll.selectorText = '#messagesParent::-webkit-scrollbar-thumb'
		ruleForScroll.style["background"] = '#' + themes[theme][1]
	})
	var secondary = document.querySelectorAll('#settings')
	secondary.forEach(secondary => {
		secondary.style.backgroundColor = '#' + themes[theme][1]
	})
	var inputs = document.querySelectorAll('input')
	inputs.forEach(inputs => {
		inputs.style.backgroundColor = '#' + themes[theme][0]
		inputs.style.borderColor = '#' + themes[theme][2]
		inputs.style.color = '#' + themes[theme][3]
	})
	var buttons = document.querySelectorAll('button')
	buttons.forEach(buttons => {
		buttons.style.backgroundColor = '#' + themes[theme][0]
		buttons.style.borderColor = '#' + themes[theme][2]
		buttons.style.color = '#' + themes[theme][3]
	})
	var dropdowns = document.querySelectorAll('select')
	dropdowns.forEach(dropdowns => {
		dropdowns.style.backgroundColor = '#' + themes[theme][1]
		dropdowns.style.color = '#' + themes[theme][3]
	})
	styleMessageElements(theme)
}

const styleMessageElements = function (theme) {
	var systemMessages = document.querySelector('#messages').querySelectorAll('.msgTypesystem')
	systemMessages.forEach(systemMessages => {
		systemMessages.style.backgroundColor = '#' + themes[theme][1]
		systemMessages.style.color = '#' + themes[theme][2]
	})
	var inputs = document.querySelector('#messages').querySelectorAll('input')
	inputs.forEach(inputs => {
		inputs.style.backgroundColor = '#' + themes[theme][0]
		inputs.style.borderColor = '#' + themes[theme][2]
		inputs.style.color = '#' + themes[theme][3]
	})
	var links = document.querySelector('#messages').querySelectorAll('a')
	links.forEach(links => {
		links.style.color = '#' + themes[theme][2]
	})
}

// EXTRA DYNAMIC CSS
const appendRule = (sheet) => {
	console.log({ sheet });
	const len = sheet.cssRules.length;
	sheet.insertRule('body{}', len);
	return sheet.cssRules[len];
}
const ruleForScroll = appendRule(Array.from(document.styleSheets).slice(-1)[0])