// == SETTINGS == //
// ============== //
const storageMax = 50
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const version = '1.0.2'
const checkInterval = 1000 // ms between each blob ping
var blobID


// == DOCUMENT AND TEXT HANDLER == //
// =============================== //
document.addEventListener("DOMContentLoaded", function () { // start scripts and begin checking for messages
	console.log("DOM Loaded")
	applyTheme('dark')
	handleCookieSetup()
	checkMessages() // initial Blob ping
	determineVersion()

	setInterval(function () {
		checkMessages()  // periodically check messages
	}, checkInterval)
})

const copyText = async function (ele) {
	let text = ele.parentElement.querySelector('.text').textContent
	await navigator.clipboard.writeText(text)
}

const linkify = function (inputText) {
	//settings.blobURLs starting with http://, https://, or ftp://
	//const replacePattern1 = new RegExp(`\b(?:(\'|\"))(((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))`, 'gim')
	const replacePattern1 = /\b(?!:(\'|\"))(((https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/gim
	return inputText.replace(replacePattern1, '<a href="$2">$2</a>')
}

const appendCode = function (string) {
	document.getElementById('textinput').value = document.getElementById('textinput').value + string
}

const showhide = function (id) {
	var e = document.getElementById(id);
	e.style.display = (e.style.display == 'block') ? 'none' : 'block';
}

function formatSelection(ele) {
	this.element = ele
	this.elementText = ele.value.toString()
	this.selStart =  this.element.selectionStart 
	this.selEnd = this.element.selectionEnd
	this.sel = this.elementText.substring(this.selStart,this.selEnd)

	this.bold = function() {
		let replacedText = this.elementText.substring(0,this.selStart) + `<b>${this.sel}</b>` + this.elementText.substring(this.selEnd,this.elementText.length)
		this.element.value = replacedText
	}
	this.italicize = function() {
		let replacedText = this.elementText.substring(0,this.selStart) + `<i>${this.sel}</i>` + this.elementText.substring(this.selEnd,this.elementText.length)
		this.element.value = replacedText
	}
	this.underline = function() {
		let replacedText = this.elementText.substring(0,this.selStart) + `<u>${this.sel}</u>` + this.elementText.substring(this.selEnd,this.elementText.length)
		this.element.value = replacedText
	}
	this.strike = function() {
		let replacedText = this.elementText.substring(0,this.selStart) + `<s>${this.sel}</s>` + this.elementText.substring(this.selEnd,this.elementText.length)
		this.element.value = replacedText
	}
	this.color = function(color) {
		let replacedText = this.elementText.substring(0,this.selStart) + `<span style="color:${color}">${this.sel}</span>` + this.elementText.substring(this.selEnd,this.elementText.length)
		this.element.value = replacedText
	}
}

const determineVersion = function() {// determine version and specs
	let href = window.location.href 
	let testbuild = href.includes('testbuild')

	let ele = document.querySelectorAll('.versionDisplay')
	ele.forEach(ele => {
		ele.innerHTML = !testbuild ? `v${version}` : `⚠ [BETA]: v${version}`
	})
	ele = document.querySelectorAll('.locationHREFDisplay')
	ele.forEach(ele => {
		ele.innerHTML = href
	})
	ele = document.querySelectorAll('.JSONBlobDisplay')
	ele.forEach(ele => {
		ele.innerHTML = 'https://jsonblob.com/api/jsonblob/' + blobID
	})
}


// == BLOB MANAGER == //
// ================== //
function BlobMessage(message, name, date) {
	this.message = message
	this.name = name
	this.date = date
	this.type = 'user'
	this.silence = false

	this.send = function () { // check that date, name, and msg have valid values; the rest are not important
		let pushData = new Object
		pushData.date = typeof this.date == 'undefined' ? new Date() : this.date
		pushData.name = typeof this.name == 'undefined' ? '' : this.name
		pushData.msg = typeof this.message == 'undefined' ? '' : this.message
		pushData.type = this.type
		pushData.silence = this.silence

		new BlobRequest().get(function (err, put) {
			if (err) { console.warn(err) }
			else {
				let history = JSON.parse(put)
				history.encryptedMessages.push(pushData)
				if (history.encryptedMessages.length >= storageMax + 1) { history.encryptedMessages.shift() } // remove previous messages if cap is reached
				writeBlob(history)
				document.getElementById("textinput").value = '' // clear message input
			}
		})
	}
}

const checkMessages = function () {
	blobID = document.getElementById("blobID").value
	new BlobRequest().get(function (err, get) {
		if (err) { console.log(err) }
		else {
			let data = JSON.parse(get)
			document.getElementById("messages").innerHTML = ""
			for (i = 0; i < data.encryptedMessages.length; i++) {
				if (data.encryptedMessages[i].date > latestDate) {
					if (document.hidden) {
						notify(data.encryptedMessages[i])
					}
					latestDate = new Date(data.encryptedMessages[i].date)
					latestDate = latestDate.toISOString()
				}
				document.getElementById("messages").innerHTML = document.getElementById("messages").innerHTML + `<div class="message msgType${data.encryptedMessages[i].type} msgColor${i % 2}"><b>${data.encryptedMessages[i].name}</b> <small>${calculateDisplayDate(data.encryptedMessages[i].date)}:</small></br><span class="text">${linkify(data.encryptedMessages[i].msg)}</span><a class="copyButton" onclick="copyText(this)">📋</a><br></div>`
			}
			styleMessageElements(getCookie('theme'))
		}
	})
}

const writeBlob = function (newData) {
	new BlobRequest().put(newData, function (err, put) {
		if (err) { console.log('cannot write to blob: ' + err) }
	})
}
// manual tools
const clearBlob = function () {
	writeBlob('{"encryptedMessages":[]}')
	let alert = new BlobMessage()
	alert.message = "MESSAGES PURGED MANUALLY"
	alert.name = "SYSTEM"
	alert.type = "system"
	alert.silence = true
	alert.send()
}

const clearLastMessage = function () {
	new BlobRequest().get(function (err, get) {
		if (err) { console.log(err) }
		else {
			let history = JSON.parse(get)
			history.encryptedMessages.pop()
			writeBlob(history)
		}
	})
}

const downloadBackup = function() {
	new BlobRequest().get(function (err,get) {
		if (err) {console.log(err)}
		else {
			let text = JSON.stringify(JSON.parse(get),null,2);  // pretty-print JSON
			let element = document.createElement('a') // build hidden <a> element
			element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text))
			element.setAttribute('download', 'MOD-Hotline-Backup.json')
			element.style.display = 'none'
			document.body.appendChild(element)
			element.click() // click <a> element to download file
			document.body.removeChild(element) //remove element
		}
	})
}


// == DATE AND TIME SCRIPTS == //
// =========================== //
let latestDate = new Date().toISOString() // declare latestDate for use in checkMessages()

const calculateDisplayDate = function (date) {
	let timestamp = new Date(date)
	let currentDate = new Date()
	let diffSecs = Math.abs(timestamp.getTime() - currentDate.getTime()) / 1000

	if (timestamp.toDateString() == currentDate.toDateString()) { // MESSAGE SENT TODAY
		if (diffSecs < 60) {
			return `Now`
		} else {
			if (diffSecs >= 60) { //more than 1 min ago
				if (diffSecs > (60 * 5)) { //more than 5 mins ago
					return `${timestamp.getHours()}:${('0' + timestamp.getMinutes()).slice(-2)}`
				}
				return `${Math.floor(diffSecs / 60)} minutes ago`
			}
		}
	} else {
		if (diffSecs > (60 * 60 * 24 * 7)) { //more than 1 week ago
			return `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()} :: ${timestamp.getHours()}:${('0' + timestamp.getMinutes()).slice(-2)}`
		} else {
			return `${weekdays[timestamp.getDay()]} :: ${timestamp.getHours()}:${('0' + timestamp.getMinutes()).slice(-2)}`
		}
	}
}

// == NOTIFICATION HANDLER == //
// ========================== //
const notify = function (input) {
	if (!("Notification" in window)) {
		console.log('Notifications not supported')
	} else if (Notification.permission === "granted") {
		let notificationMethod = getCookie('notif')
		if (input.silence === false) {
			if (notificationMethod === 'default') {
				let notification = new Notification('MOD Hotline', {
					body: `${input.name}: ${input.msg}`
				})
			} else if (notificationMethod === 'censor') {
				let notification = new Notification('MOD Hotline', {
					body: `Notification hidden`
				})
			}
		}
		return
	} else if (Notification.permission !== "denied") {
		requestNotifications()
	}
}

const requestNotifications = function () {
	if (!("Notification" in window)) {
		console.log('Notifications not supported')
		alert('Notifications are not supported by this browser 😕')
	}
	Notification.requestPermission().then((permission) => {
		// If the user accepts, create a notification
		if (permission === "granted") {
			let notification = new Notification('MOD Hotline', {
				body: `notifications set up 👍`
			})
		}
	})
}
