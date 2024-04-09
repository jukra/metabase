import { DAY_OF_WEEK_OPTIONS } from "metabase/lib/date-time";
import type { ScheduleFrameType, ScheduleSettings } from "metabase-types/api";

const dayToCron = (day: ScheduleSettings["schedule_day"]) =>
  DAY_OF_WEEK_OPTIONS.findIndex(o => o.value === day);

const frameToCron = (frame: ScheduleFrameType) =>
  ({ first: "1", last: "L", mid: "15" }[frame]);

export const scheduleSettingsToCron = (settings: ScheduleSettings): string => {
  const minute = settings.schedule_minute?.toString() ?? "*";
  const hour = settings.schedule_hour?.toString() ?? "*";
  let dayOfWeek = settings.schedule_day
    ? dayToCron(settings.schedule_day).toString()
    : "?";
  const month = "*";
  let dayOfMonth = settings.schedule_day ? "?" : "*";
  if (settings.schedule_type === "monthly" && settings.schedule_frame) {
    if (settings.schedule_day) {
      let cronifiedFrameWithHash = frameToCron(settings.schedule_frame);
      if (cronifiedFrameWithHash === "1") {
        cronifiedFrameWithHash = "#1";
      }
      const cronifiedDay = dayToCron(settings.schedule_day);
      dayOfWeek = `${cronifiedDay}${cronifiedFrameWithHash}`;
    } else {
      dayOfMonth = frameToCron(settings.schedule_frame);
    }
  }
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
};
