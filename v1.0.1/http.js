function BlobRequest() {
	// Initializing new XMLHttpRequest method.
	this.http = new XMLHttpRequest();
}

BlobRequest.prototype.put = function (data, callback) {
	this.http.open('PUT', 'https://jsonblob.com/api/jsonblob/' + blobID, true);
	this.http.setRequestHeader(
		'Content-type', 'application/json');
	let self = this;
	this.http.onload = function () {
		callback(null, self.http.responseText);
	}

	this.http.send(JSON.stringify(data));
}

BlobRequest.prototype.get = function (callback) {
	this.http.open('GET', 'https://jsonblob.com/api/jsonblob/' + blobID, true);
	this.http.setRequestHeader(
		'Content-type', 'application/json');
	let self = this;
	this.http.onload = function () {
		callback(null, self.http.responseText);
	}

	this.http.send();
}