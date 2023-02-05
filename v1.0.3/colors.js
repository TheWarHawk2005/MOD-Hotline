const themes = new Object()
themes.dark = ['2C3639', '3F4E4F', 'A27B5C', 'DCD7C9']
themes.jungle = ['483838', '42855B', '90B77D', 'D2D79F']
themes.laetare = ['1F1D36', '3F3351', '864879', 'E9A6A6']
themes.brimstone = ['211717', 'A34A28', 'F58B54', 'DFDDC7']

const paintElements = function (selectors, rules) {
	for (i = 0; i < selectors.length; i++) {
		let element = document.querySelectorAll(selectors[i])
		let ruleKeys = Object.keys(rules)
		for (r = 0; r < ruleKeys.length; r++) {
			element.forEach(element => {
				element.style[ruleKeys[r]] = rules[ruleKeys[r]]
			})
		}
	}
}

const applyTheme = function (theme) {
	if (!JSON.stringify(themes).includes(theme)) { //ensure valid theme and cookies
		theme = 'dark'
		setCookie('theme', 'dark', 3650)
	}
	ruleForScroll.selectorText = '#messagesParent::-webkit-scrollbar-thumb' // style CSS directly
	ruleForScroll.style["background"] = '#' + themes[theme][1]

	paintElements(['body', 'input', 'button', 'select'],{'color': `#${themes[theme][3]}`,'backgroundColor': `#${themes[theme][0]}`,}) //apply default background
	paintElements(['body', 'input', 'button'], {'borderColor': `#${themes[theme][2]}`}) // apply borders
	paintElements(['a'], {'color': `#${themes[theme][2]}`}) // apply highlighted color
	paintElements(['select','#textinput', '.popup'], {'backgroundColor': `#${themes[theme][1]}` }) // apply secondary background

	styleMessageElements(theme)

	console.log('Applied theme: '+theme)
}

const styleMessageElements = function (theme) { // apply every message refresh
	paintElements(['.msgTypesystem'], {'backgroundColor': `#${themes[theme][1]}`,'color':`#${themes[theme][2]}`})
	paintElements(['a'], {'color': `#${themes[theme][2]}`}) // apply highlighted color
}

// EXTRA DYNAMIC CSS
const appendRule = (sheet) => {
	console.log({ sheet });
	const len = sheet.cssRules.length;
	sheet.insertRule('body{}', len);
	return sheet.cssRules[len];
}
const ruleForScroll = appendRule(Array.from(document.styleSheets).slice(-1)[0])