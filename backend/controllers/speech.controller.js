const axios = require("axios").default;
const FormData = require("form-data");
const { ParseSRT_JSON, setUpdatedFalse } = require("../helpers");
const yauzl = require("yauzl");
const fs = require("fs");

async function uploadFile(req, res, next) {
	const form = new FormData();
	const fileDateStr = new Date().toISOString().slice(0, 10) + ".wav";
	form.append("file", req.file.buffer, fileDateStr);
	form.append("lang", req.body.lang);
	form.append("audioType", req.body.audioType);
	form.append("audioTrack", req.body.audioTrack);
	form.append("queue", "normal"); //normal, meadow9

	await axios
		.post(
			"https://gateway.speechlab.sg/speech",
			form,
			{
				headers: {
					...form.getHeaders(),
					//Authorization: `${req.headers.authorization}`,
					//'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRsdnVAbnR1LmVkdS5zZyIsInJvbGUiOiJ1c2VyIiwibmFtZSI6Ikx5IFZUIiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTY0MTg2NTc0MiwibmJmIjoxNjQxODY1NzQyLCJleHAiOjE2NDQ0NTc3NDIsImlzcyI6Imh0dHBzOi8vZ2F0ZXdheS5zcGVlY2hsYWIuc2ciLCJzdWIiOiI1ZjM0Y2ExOGJkZDg4ZDAwMjlmMWQ3N2UifQ.qJnlfP779Kwl0k9y9oLZqJjL-PMxfqO6diGkPLyCHkgj-JrEKRDaUdo-gbfSrtPe25XyZqf9vqk4KLtkyMmDX7_MgmKZ5rFPyXGlufkmpw3UdsogUr6JPm_i6t0zcbNNRhd_zRGNH-_Hq1mkgfD4TLGAyun8NvD3utVRqPQfl5vLPGtAK3669QQDCGDxl9mzmPfyHWPAJIjpQEA5luZ7IC0pM7yrUVb7tUiwhuz1VTiYKj1PqmM2q958qvTO9HUd2AnPt5XzRrwYqkIwsezaSfGRthxPcZ52Q3VgJ2jmqUc_4qZInyqrEBBLs0t6Eq5gqtQQGi7XJXRw32u2yJymbg',
					"Content-Type": "multipart/form-data",
				},
				//onUploadProgress: progressEvent => console.log(progressEvent.loaded)
			},
			{ responseType: "json" }
		)
		.then((response) => {
			console.log("submit job success");
			//console.log(response)
			setUpdatedFalse(req.body.userID);
			res.json(response.status);
		})
		.catch((error) => {
			console.log("submit job failed");
			res.json(error.response.status);
		});
}


async function getsTranscriptionJobHistory(req, res, next) {
	//speech history
	// let email = req.body;
	await axios
		.get(
			"https://gateway.speechlab.sg/speech/history",
			/* {
				data: email
		}, */
			{
				headers: {
					Authorization: `${req.headers.authorization}`,
				},
			},
			{ responseType: "json" }
		)
		.then((response) => {
			//console.log(response.data.history[0]);
			res.status(response.status).json(response.data);
		})
		.catch((error) => {
			//console.log(error.response)
			res.status(error.response.status).json(error.response.data);
		});
}


async function getTranscriptionResult(req, res, next) {
	//get transcription
  console.log("[DEBUG] received id: " + req.params.id);

	await axios
		.get(
			`https://gateway.speechlab.sg/speech/${req.params.id}/result`,
			{
				headers: {
					Authorization: `${req.headers.authorization}`,
				},
			},
			{ responseType: "json" }
		)
		.then((response) => {
			// console.log(response);
			res.status(response.status).json(response.data)
		})
		.catch((error) => {
			console.log(error);
			res.status(error.response.status).json(error.response.data)
		});
}


async function getTranscriptionInJson(req, res, next) {
  console.log("[DEBUG] received id: " + req.params.id);

  // Download to temporary folder
  // TODO delete the zipped folder after done
  const reqFileStr =
    "_temp/" +
    new Date().toLocaleTimeString().replaceAll(":", "_").slice(0, -3);

  var fileWriter = fs.createWriteStream(`${reqFileStr}.zip`);

  await axios
    .get(`https://gateway.speechlab.sg/speech/${req.params.id}/result`, {
      headers: { Authorization: `${req.headers.authorization}` },
      responseType: "json",
    })
    .then((getUrlRes) => {
      return axios.get(getUrlRes.data.url, {
        responseType: "stream",
      });
    })
    .then((dlZippedFileRes) => {
      // console.log("[DEBUG] Success sending download url, is it downloaded?")
      // console.log(dlZippedFileRes);
      dlZippedFileRes.data.pipe(fileWriter);

      // handle error
      fileWriter.on("error", (err) => {
        fileWriter.close();
        res.status(500).json(err);
      });

      var unzippedFileWriter;
      fileWriter.on("close", async () => {
        // console.log("[DEBUG] Successfully write file to local temp folder");
        yauzl.open(
          `${reqFileStr}.zip`,
          { lazyEntries: true },
          (err, zipfile) => {
            if (err) throw err;

            zipfile.readEntry();

            let srtFileName = "";

            zipfile.on("entry", (entry) => {
              // console.log(`[DEBUG] reading file: ${entry.fileName} `);

              if (entry.fileName.slice(-4) === ".srt") {
                srtFileName = entry.fileName.slice(0, -4);
              }

              if (/\/$/.test(entry.fileName)) {
                // console.log("[DEBUG] if (/\/$/.test(entry.fileName))");
                // Directory file names end with '/'.
                // Note that entires for directories themselves are optional.
                // An entry's fileName implicitly requires its parent directories to exist.
                zipfile.readEntry();
                // } else if (entry.fileName.slice(-4) === '.srt') {
              } else {
                // console.log("[DEBUG] opening read stream!");
                zipfile.openReadStream(entry, (err, readStream) => {
                  if (err) throw err;

                  readStream.on("end", () => {
                    // console.log("[DEBUG] readStream.on(end)");
                    zipfile.readEntry();
                  });

                  readStream.on("error", (err) => {
                    console.log("[DEBUG] Error in readStream");
                    console.log(err);
                  });

                  // TODO refactor reqFileStr and rename to something more meaningful
                  // Make folder and write currently unzipped file to folder
                  console.log(
                    "[DEBUG] Writing " +
                      entry.fileName +
                      " to " +
                      reqFileStr +
                      "/"
                  );
                  if (!fs.existsSync(reqFileStr)) fs.mkdirSync(reqFileStr);
                  unzippedFileWriter = fs.createWriteStream(
                    `${reqFileStr}/${entry.fileName}`
                  );
                  // console.log("[DEBUG] readStream.pipe(fileWriter2)");
                  readStream.pipe(unzippedFileWriter);
                });
              }
            });

            zipfile.on("close", (d) => {
              console.log("[DEBUG] Closing Zip File");

              let testStr = fs
                .readFileSync(`${reqFileStr}/${srtFileName}.srt`)
                .toString();

              let testRes = ParseSRT_JSON.parse(testStr);
              testRes = testRes.filter(
                (value, index, array) =>
                  array.findIndex(
                    (t) =>
                      t.startTime === value.startTime && t.text === value.text
                  ) === index
              );
              // console.log(testRes);

              fs.rmSync(`${reqFileStr}/`, { recursive: true, force: true });
              // fs.rmdirSync(`${reqFileStr}`, {recursive: true, force: true}); // works
              fs.rmSync(`${reqFileStr}.zip`, { recursive: true, force: true });

              console.log("[DEBUG] Sending Response OK");
              res.status(200).json({ transcribedText: testRes });
            });
          }
        ); // END yauzl.open(path)
      }); // END filewriter.on('close')
    })
    .catch((error) => {
      console.log(error);
      //res.status(error.response.status).json(error.response.data)
      res.status(500).json({ msg: "Something went wrong. See Logsc" });
    });
}

module.exports = {
	uploadFile,
	getsTranscriptionJobHistory,
	getTranscriptionInJson,
	getTranscriptionResult
}