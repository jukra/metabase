import styled from "@emotion/styled";

import { Loader } from "metabase/ui";

export const LoaderInButton = styled(Loader)`
  position: relative;
  top: 1px;
`;

export const InvalidateNowLoader = styled(LoaderInButton)`
  filter: brightness(100);
`;
