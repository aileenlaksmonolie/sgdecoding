const axios = require("axios").default;
const Statistics = require("../models/statistics.model");

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

async function changeName(req, res, next) {
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
}

async function addUserStatistics(req, res, next) {
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
}

module.exports = {
	changeName,
	addUserStatistics
}