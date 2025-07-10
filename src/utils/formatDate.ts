import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: Date | string) => {
  return dayjs.utc(date).tz("Africa/Nairobi").format("YYYY-MM-DD HH:mm:ss");
};
