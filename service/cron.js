const cron = require("node-cron");

/**
 * @desc    Schedules a cron job to run every minute with the provided title.
 * @param {string} title - The title of the job to be displayed in the console log.
 */

const scheduleCronJob = (title) => {
  cron.schedule(
    "*/1 * * * *",
    function () {
      console.log(`Hello, you have remain task to do - ${title}`);
    },
    {
      timeZone: "Asia/Dhaka",
      scheduled: true,
    },
  );

  isCronJobScheduled = true;
};

module.exports = scheduleCronJob;
