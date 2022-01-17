const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios").default;
const FormData = require('form-data');
const fs = require('fs');
const multer = require('multer')
//const upload = multer({ dest: 'uploads/' })
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const yauzl = require('yauzl');
const { ParseSRT_JSON } = require("./helpers");
//const path = require('path')
//const { Readable } = require('stream')

app.use(cors());
app.use(express.json());
app.listen(2000, () => {
	console.log("server started on 2000");
});

app.post("/auth/register", async (req, res) => {

	let newUser = req.body
	await axios.post(
		"https://gateway.speechlab.sg/auth/register",
		{ name: newUser.name, email: newUser.email, password: newUser.password },
		{ responseType: 'json' })
		.then(function (gatewayResponse) {
			console.log('register success')
			//res.json(response)
			console.log(gatewayResponse.status)
			res.status(gatewayResponse.status).json(gatewayResponse.data)
		})
		.catch(function (error) {
			console.log('register failed')
			console.log(error)
			//res.json(error)
			res.status(error.response.data.statusCode).json(error.response.data)
		})
	//res.json(apiResponse.data)

})

app.post("/auth/login", async (req, res) => {
	let userCreds = req.body
	console.log('email ' + userCreds.email)
	console.log('pw ' + userCreds.password)
	await axios.post(
		"https://gateway.speechlab.sg/auth/login",
		{ email: userCreds.email, password: userCreds.password },
		{ responseType: 'json' })
		.then((response) => {
			console.log('login success')
			console.log(response.status) //201
			console.log('login token: ' + response.data.accessToken)
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log('login failed')
			console.log(error.response.status) //401
			res.status(error.response.status).json(error.response.data)
		})

})

app.post("/auth/change-password", async (req, res) => {
	let newPasswordRequest = req.body
	await axios.post(
		"https://gateway.speechlab.sg/auth/change-password",
		newPasswordRequest,
		{ responseType: 'json' })
		.then((response) => {
			console.log('change pw success')
			console.log(response.status)
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log('change pw failed')
			console.log(error.response.status)
			res.status(error.response.status).json(error.response.data)
		})
})

app.post("/auth/forgot-password", async (req, res) => {
	let email = req.body
	await axios.post(
		"https://gateway.speechlab.sg/auth/forgot-password",
		email,
		{ responseType: 'json' })
		.then((response) => {
			console.log('forgot pw success')
			console.log(response.status)
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log('forget pw failed')
			console.log(error.response.status)
			res.status(error.response.status).json(error.response.data)
		})
})

app.post("/auth/reset-password", async (req, res) => {
	let newPasswordRequest = req.body
	await axios.post(
		"https://gateway.speechlab.sg/auth/reset-password",
		newPasswordRequest,
		{ responseType: 'json' })
		.then((response) => {
			console.log('reset pw success')
			console.log(response.status)
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log('reset pw failed')
			console.log(error.response.status)
			res.status(error.response.status).json(error.response.data)
		})
})

app.post("/users/change-name", async (req, res) => {
	//need to re-login for changed name to reflect
	let newNameRequest = req.body
	await axios.post(
		"https://gateway.speechlab.sg/users/change-name",
		{ newName: newNameRequest.newName },
		{
			headers: {
				'Authorization': `Bearer ${newNameRequest.token}`
			}
		},
		{ responseType: 'json' })
		.then((response) => {
			console.log('change name success')
			console.log(response)
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log('change name failed')
			res.status(error.response.status).json(error.response.data)
		})
})

app.post("/speech/", upload.single('file'), async (req, res) => {

	const form = new FormData();
	const fileDateStr = new Date().toISOString().slice(0, 10) + '.wav';
	form.append('file', req.file.buffer, fileDateStr);
	form.append('lang', req.body.lang);
	form.append('audioType', req.body.audioType)
	form.append('audioTrack', req.body.audioTrack)
	form.append('queue', 'normal') //normal, meadow9

	await axios.post(
		"https://gateway.speechlab.sg/speech",
		form,
		{
			headers: {
				...form.getHeaders(),
				'Authorization': `${req.headers.authorization}`,
				//'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRsdnVAbnR1LmVkdS5zZyIsInJvbGUiOiJ1c2VyIiwibmFtZSI6Ikx5IFZUIiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTY0MTg2NTc0MiwibmJmIjoxNjQxODY1NzQyLCJleHAiOjE2NDQ0NTc3NDIsImlzcyI6Imh0dHBzOi8vZ2F0ZXdheS5zcGVlY2hsYWIuc2ciLCJzdWIiOiI1ZjM0Y2ExOGJkZDg4ZDAwMjlmMWQ3N2UifQ.qJnlfP779Kwl0k9y9oLZqJjL-PMxfqO6diGkPLyCHkgj-JrEKRDaUdo-gbfSrtPe25XyZqf9vqk4KLtkyMmDX7_MgmKZ5rFPyXGlufkmpw3UdsogUr6JPm_i6t0zcbNNRhd_zRGNH-_Hq1mkgfD4TLGAyun8NvD3utVRqPQfl5vLPGtAK3669QQDCGDxl9mzmPfyHWPAJIjpQEA5luZ7IC0pM7yrUVb7tUiwhuz1VTiYKj1PqmM2q958qvTO9HUd2AnPt5XzRrwYqkIwsezaSfGRthxPcZ52Q3VgJ2jmqUc_4qZInyqrEBBLs0t6Eq5gqtQQGi7XJXRw32u2yJymbg',
				'Content-Type': 'multipart/form-data',
			},
			//onUploadProgress: progressEvent => console.log(progressEvent.loaded)
		},
		{ responseType: 'json' })
		.then((response) => {
			console.log('submit job success')
			console.log(response)
			//res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log('submit job failed')
			console.log(error.response.data)
			//res.status(error.response.status).json(error.response.data)
		}
		)
})

app.get("/speech/history", async (req, res) => {
	//speech history
	let email = req.body
	await axios.get(
		"https://gateway.speechlab.sg/speech/history",
		/* {
				data: email
		}, */
		{
			headers: {
				'Authorization': `${req.headers.authorization}`,
			}
		},
		{ responseType: 'json' })
		.then((response) => {
			console.log(response)
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log(error.response)
			res.status(error.response.status).json(error.response.data)
		})
})

app.post("/speech/result", async (req, res) => {
	//get transcription
	await axios.get(
		"https://gateway.speechlab.sg/speech/60b7560c9dda32002d4a360b/result",
		{
			headers: {
				'Authorization': `Bearer ${newNameRequest.token}`
			}
		},
		{ responseType: 'json' })
		.then((response) => {
			console.log(response)
			//res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log(error)
			//res.status(error.response.status).json(error.response.data)
		})
})

app.post("/users/dashboard", async (req, res) => {
	console.log('')
	let auth = req.body
	let historyData
	let historyCount
	await axios.get(
		"https://gateway.speechlab.sg/speech/history",
		{
			headers: {
				'Authorization': `Bearer ${auth.token}`
			}

		},
		{ responseType: 'json' })
		.then((response) => {
			//console.log(response)
			historyData = response.data.history
			historyCount = response.data.totalHistory
			//res.status(response.status).json(response.data)
		})
		.catch((error) => {
			//console.log(error)
			//res.status(error.response.status).json(error.response.data)
		})
	//console.log(historyData)

	let totalDuration = 0
	let totalSize = 0
	let batchCount = 0
	let liveCount = 0
	historyData.forEach(obj => {
		Object.entries(obj).forEach(([key, value]) => {
			//console.log(`${key} ${value}`);
			if (key == 'sourceFile') {
				totalDuration += value.duration
				totalSize += value.size
			}
			if (key == 'type') {
				if (value == 'batch') {
					batchCount++
				} else {
					liveCount++
				}
			}
		});
		//console.log('-------------------');
	});

	//Convert seconds to hms
	const hours = Math.floor(totalDuration / 3600);
	totalDuration %= 3600;
	const minutes = Math.floor(totalDuration / 60);
	const seconds = totalDuration % 60;

	console.log(`Total Duration: ${hours} Hours, ${minutes} Minutes, ${seconds.toFixed(2)} Seconds`)
	console.log(`Total Size: ${totalSize}`)

	console.log(`Total Number of Transcriptions: ${historyCount}`)
	console.log(`${batchCount} Batch Transcriptions`)
	console.log(`${liveCount} Live Transcriptions`)

	res.json(
		JSON.stringify({
			historyCount,
			batchCount,
			liveCount,
			totalDuration,
			hours,
			minutes,
			seconds,
			totalSize
		})
	)
})

app.get("/speech/:id/result/tojson", async (req, res) => {
	console.log("[DEBUG] received id: " + req.params.id);

	// Download to temporary folder
	// TODO delete the zipped folder after done
	const reqFileStr = "_temp/" + new Date().toLocaleTimeString().replaceAll(":", "_").slice(0, -3);

	var fileWriter = fs.createWriteStream(`${reqFileStr}.zip`);

	await axios.get(
		`https://gateway.speechlab.sg/speech/${req.params.id}/result`,
		{
			headers: { 'Authorization': `${req.headers.authorization}` },
			responseType: 'json'
		})
		.then((getUrlRes) => {
			return axios.get(getUrlRes.data.url, {
				responseType: 'stream'
			});
		})
		.then((dlZippedFileRes) => {
			console.log("[DEBUG] Success sending download url, is it downloaded?")
			// console.log(dlZippedFileRes);
			dlZippedFileRes.data.pipe(fileWriter);

			// handle error
			fileWriter.on('error', (err) => {
				fileWriter.close();
				res.status(500).json(err);
			});

			var unzippedFileWriter;
			fileWriter.on('close', async () => {
				console.log("[DEBUG] Successfully write file to local temp folder");
				yauzl.open(`${reqFileStr}.zip`, { lazyEntries: true }, (err, zipfile) => {

					if (err) throw err;

					zipfile.readEntry();

					let srtFileName = '';

					zipfile.on("entry", (entry) => {
						console.log(`[DEBUG] reading file: ${entry.fileName} `);

						if (entry.fileName.slice(-4) === '.srt') {
							srtFileName = entry.fileName.slice(0, -4);
						}

						if (/\/$/.test(entry.fileName)) {
							console.log("[DEBUG] if (/\/$/.test(entry.fileName))");
							// Directory file names end with '/'.
							// Note that entires for directories themselves are optional.
							// An entry's fileName implicitly requires its parent directories to exist.
							zipfile.readEntry();
							// } else if (entry.fileName.slice(-4) === '.srt') {
						} else {
							console.log("[DEBUG] is srt file! opening read stream!");
							zipfile.openReadStream(entry, (err, readStream) => {
								if (err) throw err;

								readStream.on("end", () => {
									console.log("[DEBUG] readStream.on(end)");
									zipfile.readEntry();
								});

								readStream.on("error", (err) => {
									console.log("[DEBUG] Error in readStream");
									console.log(err);
								})

								// TODO refactor reqFileStr and rename to something more meaningful
								// Make folder and write currently unzipped file to folder
								console.log("[DEBUG] Writing " + entry.fileName + " to " + reqFileStr + "/");
								if (!fs.existsSync(reqFileStr))
									fs.mkdirSync(reqFileStr);
								unzippedFileWriter = fs.createWriteStream(`${reqFileStr}/${entry.fileName}`);
								// console.log("[DEBUG] readStream.pipe(fileWriter2)");
								readStream.pipe(unzippedFileWriter);
							});
						}
					});

					zipfile.on('close', (d) => {
						console.log("[DEBUG] Closing Zip File");
						console.log("[DEBUG] Sending Response OK");

						let testStr = fs.readFileSync(`${reqFileStr}/${srtFileName}.srt`).toString();

						let testRes = ParseSRT_JSON.parse(testStr);
						testRes = testRes.filter((value, index, array) =>
							array.findIndex(t =>
							(
								t.startTime === value.startTime
								&& t.endTime === value.endTime
								&& t.text === value.text)
							) === index
						);
						console.log(testRes);

						fs.rmSync(`${reqFileStr}/`, {recursive: true, force: true});
						fs.rmSync(`${reqFileStr}.zip`);

						res.status(200).json({ msg: "operation OK" });
					})
				}); // END yauzl.open(path)


			}) // END filewriter.on('close')

		})
		.catch((error) => {
			console.log(error)
			//res.status(error.response.status).json(error.response.data)
			res.status(500).json({ msg: "Something went wrong. See Logsc" });
		});

});
