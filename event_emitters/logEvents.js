/* logEvent.js
   Where the event emitters files and structure of the event emitter is created.

   Authors: David Bishop
   Created Date: August 9, 2022
   Updates:
   Date, Author, Description
   August 9, 2022, David, modules, logEvents function.
*/

const moment = require("moment");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, level, logName) => {
  const dateTime = moment().format("YYYY-MM-DD HH:mm A");
  const logEvent = `${dateTime}\t${uuidv4()}\t${msg}\t${level}\n`; // Logging the request showing the date with uuid(random id), msg and level.
  if (DEBUG) console.log(logEvent);
  try {
    // If this certain path does not exist, create logs folder.
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "logs", logName),
      logEvent
    ); // Appends data from logEvent to the filename which is in this case is logName.
  } catch (err) {
    console.error(err);
  }
};

module.exports = logEvents;
