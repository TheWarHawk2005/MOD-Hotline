const handleCookieSetup = function () {
	console.log('setting up cookies')
	var username = getCookie('username')
	var blobID = getCookie('blobID')
	var theme = getCookie('theme')
	var notif = getCookie('notif')

	document.getElementById('username').value = username
	document.getElementById('blobID').value = blobID
	document.getElementById(notif).checked = true
	document.getElementById(theme).checked = true
	applyTheme(theme)
}

const saveCookies = function () {
	setCookie('username', document.getElementById('username').value, 3650)
	setCookie('blobID', document.getElementById('blobID').value, 3650)

	let theme = document.getElementsByName('theme') // get theme radio
	for (i = 0; i < theme.length; i++) {
		if (theme[i].checked) {
			setCookie('theme', theme[i].value, 3650)
			applyTheme(theme[i].value)
		}
	}
	let notif = document.getElementsByName('notifications') // get notification radio
	for (i = 0; i < notif.length; i++) {
		if (notif[i].checked) {
			setCookie('notif', notif[i].value, 3650)
		}
	}
}

const setCookie = function (cname, cvalue, exdays) {
	const d = new Date()
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
	let expires = "expires=" + d.toUTCString()
	document.cookie = `${cname}=${cvalue};${expires};path=/`
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}