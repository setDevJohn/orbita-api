const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const endOfDay = dayjs("2025-09-10 15:15:15")
  .set("hour", 23)
  .set("minute", 59)
  .set("second", 59)
  .set("millisecond", 999)
  .tz("America/Sao_Paulo")
  .format("YYYY-MM-DD HH:mm:ssZ");

console.log(endOfDay);
