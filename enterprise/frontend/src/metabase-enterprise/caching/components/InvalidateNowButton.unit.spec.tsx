import fetchMock from "fetch-mock";
import { screen } from "__support__/ui";

import type { SetupOpts } from "metabase/admin/performance/components/test-utils";
import { setup as baseSetup } from "metabase/admin/performance/components/test-utils";

function setup(opts: SetupOpts = {}) {
  baseSetup({
    hasEnterprisePlugins: true,
    tokenFeatures: { cache_granular_controls: true },
    ...opts,
  });
}

describe("InvalidateNowButton", () => {
  beforeEach(() => {
    setup();
  });
  afterEach(() => {
    fetchMock.restore();
  });
});
