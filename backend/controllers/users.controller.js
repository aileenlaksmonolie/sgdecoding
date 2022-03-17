const axios = require("axios").default;
const Statistics = require("../models/statistics.model");
const User = require("../models/user.model");

async function getStats(userID) {
	try {
		const updatedStat = await Statistics.findById(userID);

		// while (i < 7) {
		// 	const createdDate = new Date(userDetails.created_at);
		// 	var result = createdDate.setDate(createdDate.getDate() + daysToAdd);
		// 	console.log(new Date(result));
		// 	daysToAdd += 30;
		// 	i++;
		// }

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
		const userDetails = await User.findById(userID); 	
		const createdDate = new Date(userDetails.created_at);
		var today = new Date();
		var startDate, endDate;

		const oneDay = 24 * 60 * 60 * 1000;
		const diffDays = Math.round(Math.abs((today - createdDate) / oneDay));
		console.log("Account age in days: " + diffDays);
		
		if (diffDays > 30) {
			var createdDateCopy = new Date(userDetails.created_at);
			var findStart = createdDateCopy.setDate(createdDateCopy.getDate() + (diffDays - (diffDays % 30)));
			startDate = new Date(findStart);

			var tempDate = new Date(findStart);
			var findEnd = tempDate.setDate(tempDate.getDate() + 30);
			endDate = new Date(findEnd);

			console.log("Start date: " + startDate);
			console.log("End date:" + endDate);
			
		} else {
			var createdDateCopy1 = new Date(userDetails.created_at);
			startDate = new Date(userDetails.created_at);
			var findEnd1 = createdDateCopy1.setDate(createdDateCopy1.getDate() + 30);
			endDate = new Date(findEnd1);
			console.log("Start date: " + startDate);
			console.log("End date:" + endDate);
		}
		// var dt = new Date();
		// var currentMonth = dt.getMonth();
		// var currentYear = dt.getFullYear();

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
			// const fileMonth = fileDate.getMonth();
			// const fileYear = fileDate.getFullYear();
			// if (fileMonth === currentMonth && fileYear === currentYear) {
			// 	monthlyFileCount++;
			// 	if (obj.liveSessionDuration != null) {
			// 		monthlyLiveDuration += obj.liveSessionDuration;
			// 	} else {
			// 		monthlyBatchDuration += obj.sourceFile.duration;
			// 	}
			// }
			if (fileDate.getTime() >= startDate.getTime() && fileDate.getTime() <= endDate.getTime()) {
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
					liveDuration += value;
					totalDuration += value;
				}
				if (key === "sourceFile") {
					batchDuration += value.duration;
					totalDuration += value.duration;
				}
				// if (key === "userCreated") {
				// 	console.log(value);
				// 	console.log(value["createdAt"]);
				// 	userCreatedDate = new Date(value["createdAt"]);
				// }
			});
		});

		const minutesTranscribed = Math.round(totalDuration / 60);
		const monthlyLiveDurationMins = Math.round(monthlyLiveDuration / 60);
		const monthlyBatchDurationMins = Math.round(monthlyBatchDuration / 60);

		console.log(`Total Number of Transcriptions: ${transcriptionCount}`);
		console.log(`${batchCount} Batch Transcriptions`);
		console.log(`${liveCount} Live Transcriptions`);
		console.log(`Total Duration (Mins): ${minutesTranscribed}`);
		console.log(`Total Batch Duration: ${batchDuration}`);
		console.log(`Total Live Duration: ${liveDuration}`);
		console.log(`Total Pending Jobs: ${pendingCount}`);
		console.log("Total Transcriptions This Month: " + monthlyFileCount);
		console.log("This Month's Live Duration (Mins): " + monthlyLiveDurationMins);
		console.log("This Month's Batch Duration (Mins): " + monthlyBatchDurationMins);
		console.log("-----------------------------------------------------------");
		
		var liveQuota = false, offlineQuota = false;
		if (monthlyLiveDurationMins >= process.env.LIVE_TRANSCRIBE_QUOTA) {
			liveQuota = true;
		}
		if (monthlyBatchDurationMins >= process.env.OFFLINE_TRANSCRIBE_QUOTA) {
			offlineQuota = true;
		}

		if (currentStat === null) {
			await Statistics.create({
				_id: userID,
				total_jobs: transcriptionCount,
				pending_jobs: pendingCount,
				total_minutes_transcribed: minutesTranscribed,
				monthly_live_minutes: monthlyLiveDurationMins,
				monthly_offline_minutes: monthlyBatchDurationMins,
				start_date: startDate,
				end_date: endDate,
				live_quota: liveQuota,
				offline_quota: offlineQuota,
				updated: true,
			});
		} else {
			currentStat.total_jobs = transcriptionCount;
			currentStat.pending_jobs = pendingCount;
			currentStat.total_minutes_transcribed = minutesTranscribed;
			currentStat.monthly_live_minutes = monthlyLiveDurationMins;
			currentStat.monthly_offline_minutes = monthlyBatchDurationMins;
			currentStat.start_date = startDate;
			currentStat.end_date = endDate;
			currentStat.live_quota = liveQuota;
			currentStat.offline_quota = offlineQuota;
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