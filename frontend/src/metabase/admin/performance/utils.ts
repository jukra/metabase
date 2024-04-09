import { DAY_OF_WEEK_OPTIONS } from "metabase/lib/date-time";
import type { ScheduleFrameType, ScheduleSettings } from "metabase-types/api";

const dayToCron = (day: ScheduleSettings["schedule_day"]) => {
  const index = DAY_OF_WEEK_OPTIONS.findIndex(o => o.value === day);
  if (index === -1) {
    throw new Error(`Invalid day: ${day}`);
  }
  return index + 1;
};

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
      const cronifiedFrame = frameToCron(settings.schedule_frame).replace(
        /^1$/,
        "#1",
      );
      const cronifiedDay = dayToCron(settings.schedule_day);
      dayOfWeek = `${cronifiedDay}${cronifiedFrame}`;
    } else {
      dayOfMonth = frameToCron(settings.schedule_frame);
    }
  }
  return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
};

// A return value of null means we couldn't convert the cron to a ScheduleSettings object
export const cronToScheduleSettings = (
  cron: string | null | undefined,
): ScheduleSettings | null => {
  if (!cron) {
    return defaultSchedule;
  }
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(" ");
  if (month !== "*") {
    return null;
  }
  const schedule_type = dayOfMonth === "*" ? "monthly" : "weekly";
  let schedule_frame: ScheduleFrameType | undefined;
  let schedule_day: string | undefined;
  if (schedule_type === "monthly") {
    if (dayOfWeek === "?") {
      schedule_frame = dayOfMonth === "15" ? "mid" : "first";
    } else {
      const day = parseInt(dayOfWeek);
      const frame = day > 5 ? "last" : "first";
      schedule_frame = frame as ScheduleFrameType;
      schedule_day = DAY_OF_WEEK_OPTIONS[day - 1].value;
    }
  } else {
    schedule_day = DAY_OF_WEEK_OPTIONS[parseInt(dayOfWeek) - 1].value;
  }
  return {
    schedule_type,
    schedule_minute: parseInt(minute),
    schedule_hour: parseInt(hour),
    schedule_day,
    schedule_frame,
  };
};

const defaultSchedule: ScheduleSettings = {
  schedule_type: "hourly",
};
