import userEvent from "@testing-library/user-event";
import fetchMock from "fetch-mock";

import { screen } from "__support__/ui";

import { getLastHomepageSettingSettingCall, setup } from "./setup";

describe("EmbedHomepage (OSS)", () => {
  it("should default to the static tab for OSS builds", () => {
    setup();
    expect(
      screen.getByText("Use static embedding", { exact: false }),
    ).toBeInTheDocument();

    // making sure Tabs isn't just rendering both tabs, making the test always pass

    expect(
      screen.queryByText("Use interactive embedding", { exact: false }),
    ).not.toBeInTheDocument();
  });

  it("should link to the docs", () => {
    setup();
    expect(screen.getByText("Learn more")).toHaveAttribute(
      "href",
      "https://www.metabase.com/docs/latest/embedding/static-embedding.html",
    );
  });

  it("should prompt to enable embedding if it wasn't auto enabled", () => {
    setup({ settings: { "setup-embedding-autoenabled": false } });

    expect(
      screen.getByText("Enable embedding in the settings"),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Embedding has been automatically enabled for you"),
    ).not.toBeInTheDocument();
  });

  it("should not prompt to enable embedding if it was auto enabled", () => {
    setup({ settings: { "setup-embedding-autoenabled": true } });

    expect(
      screen.queryByText("Enable embedding in the settings"),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText("Embedding has been automatically enabled for you"),
    ).toBeInTheDocument();
  });

  it("should set 'embedding-homepage' to 'dismissed-done' when dismissing as done", async () => {
    setup();
    await userEvent.hover(screen.getByText("Hide these"));

    await userEvent.click(screen.getByText("Embedding done, all good"));

    const lastCall = getLastHomepageSettingSettingCall();

    const body = await lastCall?.request?.json();
    expect(body).toEqual({ value: "dismissed-done" });
  });

  describe("Feedback modal", () => {
    // should ask for feedback when dismissing because of issues
    it("should ask for feedback when dismissing because of issues", () => {
      setup();
      userEvent.hover(screen.getByText("Hide these"));

      userEvent.click(screen.getByText("I ran into issues"));

      expect(
        screen.getByText("How can we improve embedding?"),
      ).toBeInTheDocument();
    });

    it("should not dismiss the homepage when the user cancels the feedback modal", () => {
      setup();
      userEvent.hover(screen.getByText("Hide these"));

      userEvent.click(screen.getByText("I ran into issues"));

      userEvent.click(screen.getByText("Cancel"));

      expect(getLastHomepageSettingSettingCall()).toBeUndefined();
    });

    // should dismiss when submitting feedback - even if empty
    it("should dismiss when submitting feedback - even if empty", async () => {
      setup();
      userEvent.hover(screen.getByText("Hide these"));

      userEvent.click(screen.getByText("I ran into issues"));

      userEvent.click(screen.getByText("Skip"));

      const lastCall = getLastHomepageSettingSettingCall();

      const body = await lastCall?.request?.json();
      expect(body).toEqual({ value: "dismiss-run-into-issues" });
    });

    // should send feedback when submitting the modal
    it("should send feedback when submitting the modal", async () => {
      setup();
      userEvent.hover(screen.getByText("Hide these"));

      userEvent.click(screen.getByText("I ran into issues"));

      userEvent.type(
        screen.getByLabelText("Feedback"),
        "I had an issue with X",
      );
      userEvent.type(screen.getByLabelText("Email"), "user@example.org");

      userEvent.click(screen.getByText("Send"));

      // dismisses the embeddimg homepage
      const lastCall = getLastHomepageSettingSettingCall();
      const body = await lastCall?.request?.json();
      expect(body).toEqual({ value: "dismiss-run-into-issues" });

      // feedback call
      const feedbackCall = fetchMock.lastCall("path:/api/product-feedback", {
        method: "POST",
      });
      expect(feedbackCall).not.toBeUndefined();
      const feedbackBody = await feedbackCall?.request?.json();

      expect(feedbackBody).toMatchObject({
        comments: "I had an issue with X",
        email: "user@example.org",
      });
    });
  });
});
