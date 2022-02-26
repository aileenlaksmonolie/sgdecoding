const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios").default;
const compression = require("compression");
const { setUpdatedFalse } = require("./helpers");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Statistics = require("./models/statistics.model");
const httpProxy = require("http-proxy");
const jwt_decode = require("jwt-decode");
require('dotenv').config();

// Live Transcribe Proxy
var liveJobOpen = false;
var proxyUserID = "";
const proxy = httpProxy
  .createServer({
    target: "wss://gateway.speechlab.sg",
    changeOrigin: true,
    ws: true,
  })
  .listen(8080, () => console.log(`Live Transcribe Proxy Server started on port 8080`));

proxy.on("error", function (err, req, res) {
  res.writeHead(500, {
    "Content-Type": "text/plain",
  });
  res.end("Live Transcribe Connection Failed");
});

proxy.on('proxyReqWs', function(proxyReqWs) {
  const path = proxyReqWs.path;
  const startPos = path.search("accessToken=");
  const endPos = path.search("&model");  
  const proxyToken = path.substring(startPos+12, endPos);
  proxyUserID = jwt_decode(proxyToken).sub;
});

proxy.on("open", function (proxySocket) {
  // listen for messages coming FROM the target here
  console.log("Live Transcribe Connection Open");
  liveJobOpen = true;
  proxySocket.on("data", (buffer) => {
    console.log(buffer.toString());
  });
});

proxy.on("close", function (res, socket, head) {
  // view disconnected websocket connections
  console.log("Live Transcribe Disconnected");
  if (liveJobOpen) {
    setUpdatedFalse(proxyUserID);
    liveJobOpen = false;
  }
});

// Mongoose (MongoDB) Database
mongoose.connect(
  "mongodb+srv://terry:node1234@cluster0.m84iv.mongodb.net/SG_Decoding?retryWrites=true&w=majority"
  //"mongodb://localhost:27017/SG_Decoding?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
  //"mongodb://localhost:27017/SG_Decoding"
  // "mongodb://mongo:27017/SG_Decoding"
  // process.env.DB_CONNECTION_STRING
);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Mongoose Connection Successful!");
});

app.use(cors());
app.use(express.json());
app.use(compression());

app.use(require('./routes'));

app.listen(2000, () => {
  console.log("Server started on port 2000");
});

app.post("/add_user", async (request, response) => {
  const user = new User(request.body);
  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users", async (request, response) => {
  const users = await User.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

// app.post("/auth/register", async (req, res) => {
//   let newUser = req.body;
//   await axios
//     .post(
//       "https://gateway.speechlab.sg/auth/register",
//       { name: newUser.name, email: newUser.email, password: newUser.password },
//       { responseType: "json" }
//     )
//     .then(async function (gatewayResponse) {
//       console.log("register success");
//       console.log(gatewayResponse.status);
//       await User.create({
//         _id: gatewayResponse.data._id,
//         email: gatewayResponse.data.email,
//         role: gatewayResponse.data.role,
//         last_login: gatewayResponse.data.createdAt,
//       });
//       res.status(gatewayResponse.status).json(gatewayResponse.data);
//     })
//     .catch(function (error) {
//       console.log("register failed");
//       console.log(error);
//       res.status(error.response.data.statusCode).json(error.response.data);
//     });
//   //res.json(apiResponse.data)
// });

// app.post("/auth/login", async (req, res) => {
//   let userCreds = req.body;
//   console.log("Email: " + userCreds.email);
//   console.log("PW: " + userCreds.password);
//   await axios
//     .post(
//       "https://gateway.speechlab.sg/auth/login",
//       { email: userCreds.email, password: userCreds.password },
//       { responseType: "json" }
//     )
//     .then(async (response) => {
//       console.log("Login Success");
//       const userLastLogin = await getLoginAndUpdate(userCreds.email);
//       res.status(response.status).json(
//         {
//           accessToken: response.data.accessToken,
//           lastLogin: userLastLogin
//         });
//     })
//     .catch((error) => {
//       console.log("Login Failed");
//       console.log(error.response.status);
//       res.status(error.response.status).json(error.response.data);
//     });
// });

// app.post("/auth/change-password", async (req, res) => {
//   let newPasswordRequest = req.body;
//   await axios
//     .post(
//       "https://gateway.speechlab.sg/auth/change-password",
//       newPasswordRequest,
//       { responseType: "json" }
//     )
//     .then((response) => {
//       console.log("change pw success");
//       console.log(response.status);
//       res.status(response.status).json(response.data);
//     })
//     .catch((error) => {
//       console.log("change pw failed");
//       console.log(error.response.status);
//       res.status(error.response.status).json(error.response.data);
//     });
// });

// app.post("/auth/forgot-password", async (req, res) => {
//   let email = req.body;
//   await axios
//     .post("https://gateway.speechlab.sg/auth/forgot-password", email, {
//       responseType: "json",
//     })
//     .then((response) => {
//       console.log("forgot pw success");
//       console.log(response.status);
//       res.status(response.status).json(response.data);
//     })
//     .catch((error) => {
//       console.log("forget pw failed");
//       console.log(error.response.status);
//       res.status(error.response.status).json(error.response.data);
//     });
// });

// app.post("/auth/reset-password", async (req, res) => {
//   let newPasswordRequest = req.body;
//   await axios
//     .post(
//       "https://gateway.speechlab.sg/auth/reset-password",
//       newPasswordRequest,
//       { responseType: "json" }
//     )
//     .then((response) => {
//       console.log("reset pw success");
//       console.log(response.status);
//       res.status(response.status).json(response.data);
//     })
//     .catch((error) => {
//       console.log("reset pw failed");
//       console.log(error.response.status);
//       res.status(error.response.status).json(error.response.data);
//     });
// });

app.post("/users/change-name", async (req, res) => {
  //need to re-login for changed name to reflect
  let newNameRequest = req.body;
  await axios
    .post(
      "https://gateway.speechlab.sg/users/change-name",
      { newName: newNameRequest.newName },
      {
        headers: {
          Authorization: `Bearer ${newNameRequest.token}`,
        },
      },
      { responseType: "json" }
    )
    .then((response) => {
      console.log("change name success");
      console.log(response);
      res.status(response.status).json(response.data);
    })
    .catch((error) => {
      console.log("change name failed");
      res.status(error.response.status).json(error.response.data);
    });
});

// app.post("/speech/", upload.single("file"), async (req, res) => {
//   const form = new FormData();
//   const fileDateStr = new Date().toISOString().slice(0, 10) + ".wav";
//   form.append("file", req.file.buffer, fileDateStr);
//   form.append("lang", req.body.lang);
//   form.append("audioType", req.body.audioType);
//   form.append("audioTrack", req.body.audioTrack);
//   form.append("queue", "normal"); //normal, meadow9

//   await axios
//     .post(
//       "https://gateway.speechlab.sg/speech",
//       form,
//       {
//         headers: {
//           ...form.getHeaders(),
//           //Authorization: `${req.headers.authorization}`,
//           //'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRsdnVAbnR1LmVkdS5zZyIsInJvbGUiOiJ1c2VyIiwibmFtZSI6Ikx5IFZUIiwidHlwZSI6Im5vcm1hbCIsImlhdCI6MTY0MTg2NTc0MiwibmJmIjoxNjQxODY1NzQyLCJleHAiOjE2NDQ0NTc3NDIsImlzcyI6Imh0dHBzOi8vZ2F0ZXdheS5zcGVlY2hsYWIuc2ciLCJzdWIiOiI1ZjM0Y2ExOGJkZDg4ZDAwMjlmMWQ3N2UifQ.qJnlfP779Kwl0k9y9oLZqJjL-PMxfqO6diGkPLyCHkgj-JrEKRDaUdo-gbfSrtPe25XyZqf9vqk4KLtkyMmDX7_MgmKZ5rFPyXGlufkmpw3UdsogUr6JPm_i6t0zcbNNRhd_zRGNH-_Hq1mkgfD4TLGAyun8NvD3utVRqPQfl5vLPGtAK3669QQDCGDxl9mzmPfyHWPAJIjpQEA5luZ7IC0pM7yrUVb7tUiwhuz1VTiYKj1PqmM2q958qvTO9HUd2AnPt5XzRrwYqkIwsezaSfGRthxPcZ52Q3VgJ2jmqUc_4qZInyqrEBBLs0t6Eq5gqtQQGi7XJXRw32u2yJymbg',
//           "Content-Type": "multipart/form-data",
//         },
//         //onUploadProgress: progressEvent => console.log(progressEvent.loaded)
//       },
//       { responseType: "json" }
//     )
//     .then((response) => {
//       console.log("submit job success");
//       //console.log(response)
//       setUpdatedFalse(req.body.userID);
//       res.json(response.status);
//     })
//     .catch((error) => {
//       console.log("submit job failed");
//       res.json(error.response.status);
//     });
// });

// app.get("/speech/history", async (req, res) => {
//   //speech history
//   let email = req.body;
//   await axios
//     .get(
//       "https://gateway.speechlab.sg/speech/history",
//       /* {
// 				data: email
// 		}, */
//       {
//         headers: {
//           Authorization: `${req.headers.authorization}`,
//         },
//       },
//       { responseType: "json" }
//     )
//     .then((response) => {
//       //console.log(response.data.history[0]);
//       res.status(response.status).json(response.data);
//     })
//     .catch((error) => {
//       //console.log(error.response)
//       res.status(error.response.status).json(error.response.data);
//     });
// });

// TO_ASK_TERRY What is this supposed to do??
app.post("/speech/result", async (req, res) => {
  //get transcription
  await axios
    .get(
      "https://gateway.speechlab.sg/speech/60b7560c9dda32002d4a360b/result",
      {
        headers: {
          Authorization: `Bearer ${newNameRequest.token}`,
        },
      },
      { responseType: "json" }
    )
    .then((response) => {
      // console.log(response);
      //res.status(response.status).json(response.data)
    })
    .catch((error) => {
      console.log(error);
      //res.status(error.response.status).json(error.response.data)
    });
});

app.post("/users/statistics", async (req, res) => {
  const userID = req.body.userID;
  const currentStat = await Statistics.findById(userID);
  if (currentStat !== null && currentStat.updated) {
    res.json(await getStats(userID));
  } else {
    let historyData;
    let transcriptionCount;
    await axios
      .get(
        "https://gateway.speechlab.sg/speech/history",
        {
          headers: {
            Authorization: `${req.headers.authorization}`,
          },
        },
        { responseType: "json" }
      )
      .then((response) => {
        //console.log(response)
        historyData = response.data.history;
        transcriptionCount = response.data.totalHistory;
        //res.status(response.status).json(response.data)
      })
      .catch((error) => {
        //console.log(error)
        //res.status(error.response.status).json(error.response.data)
      });

    var dt = new Date();
    var currentMonth = dt.getMonth();
    var currentYear = dt.getFullYear();

    let totalDuration = 0;
    let batchCount = 0;
    let liveCount = 0;
    let batchDuration = 0;
    let liveDuration = 0;
    let pendingCount = 0;
    let monthlyFileCount = 0;

    let monthlyBatchDuration = 0;
    let monthlyLiveDuration = 0;

    historyData.forEach((obj) => {
      const fileDate = new Date(obj.createdAt);

      const fileMonth = fileDate.getMonth();
      const fileYear = fileDate.getFullYear();
      if (fileMonth === currentMonth && fileYear === currentYear) {
        monthlyFileCount++;
        if (obj.liveSessionDuration != null) {
          monthlyLiveDuration += obj.liveSessionDuration;
        } else {
          monthlyBatchDuration += obj.sourceFile.duration;
        }
      }
      Object.entries(obj).forEach(([key, value]) => {
        //console.log(key + " : " + value)
        if (key === "input") {
          //console.log(value[0])
          if (value[0].status === "pending") {
            //status types: pending, unknown, error, done
            pendingCount++;
          }
        }
        if (key === "type") {
          if (value === "batch") {
            batchCount++;
          } else {
            liveCount++;
          }
        }
        if (key === "liveSessionDuration") {
          //console.log("live: " + value);
          liveDuration += value;
          totalDuration += value;
        }
        if (key === "sourceFile") {
          //console.log("sf: " + value.duration);
          batchDuration += value.duration;
          totalDuration += value.duration;
        }
      });
    });

    const minutesTranscribed = Math.round(totalDuration / 60);
    const monthlyLiveDurationMins = Math.round(monthlyLiveDuration / 60);
    const monthlyBatchDurationMins = Math.round(monthlyBatchDuration / 60);

    // console.log(`Total Number of Transcriptions: ${transcriptionCount}`);
    // console.log(`${batchCount} Batch Transcriptions`);
    // console.log(`${liveCount} Live Transcriptions`);
    // console.log(`Total Duration (Mins): ${minutesTranscribed}`);
    // console.log(`Total Batch Duration: ${batchDuration}`);
    // console.log(`Total Live Duration: ${liveDuration}`);
    // console.log(`Total Pending Jobs: ${pendingCount}`);
    // console.log("Total Transcriptions This Month: " + monthlyFileCount);
    // console.log("This Month's Live Duration (Mins): " + monthlyLiveDurationMins);
    // console.log("This Month's Batch Duration (Mins): " + monthlyBatchDurationMins);
    // console.log("-----------------------------------------------------------");

    if (currentStat === null) {
      await Statistics.create({
        _id: userID,
        total_jobs: transcriptionCount,
        pending_jobs: pendingCount,
        total_minutes_transcribed: minutesTranscribed,
        monthly_live_minutes: monthlyLiveDurationMins,
        monthly_offline_minutes: monthlyBatchDurationMins,
        updated: true,
      });
    } else {
      currentStat.total_jobs = transcriptionCount;
      currentStat.pending_jobs = pendingCount;
      currentStat.total_minutes_transcribed = minutesTranscribed;
      currentStat.monthly_live_minutes = monthlyLiveDurationMins;
      currentStat.monthly_offline_minutes = monthlyBatchDurationMins;
      currentStat.updated = true;
      await currentStat.save();
    }
    res.json(await getStats(userID));
  }
});

// async function getLoginAndUpdate(userEmail) {
//   try {
//     const filter = { email: userEmail };
//     const update = { last_login: new Date() };
//     const user = await User.findOneAndUpdate(filter, update);
//     console.log("last login updated");
//     return user.last_login; // previous value before update
//   } 
//   catch(err) {
//     console.log("last login update failed");
//     return err;
//   }
// }

async function getStats(userID) {
  try {
    const updatedStat = await Statistics.findById(userID);
    return {
      transcriptionCount: updatedStat.total_jobs,
      pendingCount: updatedStat.pending_jobs,
      minutesTranscribed: updatedStat.total_minutes_transcribed,
      monthlyLiveDurationMins: updatedStat.monthly_live_minutes,
      monthlyBatchDurationMins: updatedStat.monthly_offline_minutes,
    };
  } catch(err) {
    console.log("get stats failed");
    return err;
  }
}


// app.get("/speech/:id/result/tojson", async (req, res) => {
//   console.log("[DEBUG] received id: " + req.params.id);

//   // Download to temporary folder
//   // TODO delete the zipped folder after done
//   const reqFileStr =
//     "_temp/" +
//     new Date().toLocaleTimeString().replaceAll(":", "_").slice(0, -3);

//   var fileWriter = fs.createWriteStream(`${reqFileStr}.zip`);

//   await axios
//     .get(`https://gateway.speechlab.sg/speech/${req.params.id}/result`, {
//       headers: { Authorization: `${req.headers.authorization}` },
//       responseType: "json",
//     })
//     .then((getUrlRes) => {
//       return axios.get(getUrlRes.data.url, {
//         responseType: "stream",
//       });
//     })
//     .then((dlZippedFileRes) => {
//       // console.log("[DEBUG] Success sending download url, is it downloaded?")
//       // console.log(dlZippedFileRes);
//       dlZippedFileRes.data.pipe(fileWriter);

//       // handle error
//       fileWriter.on("error", (err) => {
//         fileWriter.close();
//         res.status(500).json(err);
//       });

//       var unzippedFileWriter;
//       fileWriter.on("close", async () => {
//         // console.log("[DEBUG] Successfully write file to local temp folder");
//         yauzl.open(
//           `${reqFileStr}.zip`,
//           { lazyEntries: true },
//           (err, zipfile) => {
//             if (err) throw err;

//             zipfile.readEntry();

//             let srtFileName = "";

//             zipfile.on("entry", (entry) => {
//               // console.log(`[DEBUG] reading file: ${entry.fileName} `);

//               if (entry.fileName.slice(-4) === ".srt") {
//                 srtFileName = entry.fileName.slice(0, -4);
//               }

//               if (/\/$/.test(entry.fileName)) {
//                 // console.log("[DEBUG] if (/\/$/.test(entry.fileName))");
//                 // Directory file names end with '/'.
//                 // Note that entires for directories themselves are optional.
//                 // An entry's fileName implicitly requires its parent directories to exist.
//                 zipfile.readEntry();
//                 // } else if (entry.fileName.slice(-4) === '.srt') {
//               } else {
//                 // console.log("[DEBUG] opening read stream!");
//                 zipfile.openReadStream(entry, (err, readStream) => {
//                   if (err) throw err;

//                   readStream.on("end", () => {
//                     // console.log("[DEBUG] readStream.on(end)");
//                     zipfile.readEntry();
//                   });

//                   readStream.on("error", (err) => {
//                     console.log("[DEBUG] Error in readStream");
//                     console.log(err);
//                   });

//                   // TODO refactor reqFileStr and rename to something more meaningful
//                   // Make folder and write currently unzipped file to folder
//                   console.log(
//                     "[DEBUG] Writing " +
//                       entry.fileName +
//                       " to " +
//                       reqFileStr +
//                       "/"
//                   );
//                   if (!fs.existsSync(reqFileStr)) fs.mkdirSync(reqFileStr);
//                   unzippedFileWriter = fs.createWriteStream(
//                     `${reqFileStr}/${entry.fileName}`
//                   );
//                   // console.log("[DEBUG] readStream.pipe(fileWriter2)");
//                   readStream.pipe(unzippedFileWriter);
//                 });
//               }
//             });

//             zipfile.on("close", (d) => {
//               console.log("[DEBUG] Closing Zip File");

//               let testStr = fs
//                 .readFileSync(`${reqFileStr}/${srtFileName}.srt`)
//                 .toString();

//               let testRes = ParseSRT_JSON.parse(testStr);
//               testRes = testRes.filter(
//                 (value, index, array) =>
//                   array.findIndex(
//                     (t) =>
//                       t.startTime === value.startTime && t.text === value.text
//                   ) === index
//               );
//               // console.log(testRes);

//               fs.rmSync(`${reqFileStr}/`, { recursive: true, force: true });
//               // fs.rmdirSync(`${reqFileStr}`, {recursive: true, force: true}); // works
//               fs.rmSync(`${reqFileStr}.zip`, { recursive: true, force: true });

//               console.log("[DEBUG] Sending Response OK");
//               res.status(200).json({ transcribedText: testRes });
//             });
//           }
//         ); // END yauzl.open(path)
//       }); // END filewriter.on('close')
//     })
//     .catch((error) => {
//       console.log(error);
//       //res.status(error.response.status).json(error.response.data)
//       res.status(500).json({ msg: "Something went wrong. See Logsc" });
//     });
// });

app.get("/files/:id/download", async (req, res) => {
  const { id } = req.params;

  await axios
    .get(
      `https://gateway.speechlab.sg/files/${id}/download`,
      {
        headers: {
          Authorization: `${req.headers.authorization}`,
        },
      },
      { responseType: "json" }
    )
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong with your request!" });
    });
});
