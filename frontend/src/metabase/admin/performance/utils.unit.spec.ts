import type { ScheduleSettings } from "metabase-types/api";

import { scheduleSettingsToCron } from "./utils";

describe("scheduleSettingsToCron", () => {
  it("converts hourly schedule to cron", () => {
    const settings: ScheduleSettings = {
      schedule_type: "hourly",
      schedule_minute: 1,
      schedule_hour: 1,
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("1 1 * * ?");
  });

  it("converts daily schedule to cron", () => {
    const settings: ScheduleSettings = {
      schedule_type: "daily",
      schedule_minute: 30,
      schedule_hour: 14,
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("30 14 * * ?");
  });

  it("converts weekly schedule to cron", () => {
    const settings: ScheduleSettings = {
      schedule_type: "weekly",
      schedule_day: "mon",
      schedule_minute: 0,
      schedule_hour: 12,
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("0 12 * * 1");
  });

  it("converts 'first Wednesday of the month at 9:15am' to cron", () => {
    const settings: ScheduleSettings = {
      schedule_type: "monthly",
      schedule_day: "wed",
      schedule_frame: "first",
      schedule_minute: 15,
      schedule_hour: 9,
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("15 9 * * 3#1");
  });

  it("converts 'last calendar day of the month' to cron", () => {
    const settings: ScheduleSettings = {
      schedule_type: "monthly",
      schedule_frame: "last",
      schedule_minute: 45,
      schedule_hour: 16,
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("45 16 L * ?");
  });

  it("converts 'monthly on the 15th' to cron", () => {
    const settings: ScheduleSettings = {
      schedule_type: "monthly",
      schedule_frame: "mid",
      schedule_minute: 5,
      schedule_hour: 23,
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("05 23 15 * ?");
  });

  it("missing minute and hour should default to wildcard", () => {
    const settings: ScheduleSettings = {
      schedule_type: "daily",
    };
    const cron = scheduleSettingsToCron(settings);
    expect(cron).toEqual("* * * * ?");
  });
});
