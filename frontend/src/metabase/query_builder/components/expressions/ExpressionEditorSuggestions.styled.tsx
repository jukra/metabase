import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { QueryColumnInfoIcon as BaseQueryColumnInfoIcon } from "metabase/components/MetadataInfo/ColumnInfoIcon";
import TippyPopover from "metabase/components/Popover/TippyPopover";
import { alpha, color } from "metabase/lib/colors";

export const ExpressionPopover = styled(TippyPopover)`
  border-color: ${alpha("accent2", 0.2)};
  border-radius: 0;
`;

export const ExpressionList = styled.ul`
  min-width: 150px;
  overflow-y: auto;
`;

export const SuggestionMatch = styled.span`
  font-weight: bold;
`;

const highlighted = css`
  color: ${color("white")};
  background-color: ${color("brand")};
`;

export const ExpressionListItem = styled.li<{ isHighlighted: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 0.875rem;
  padding-right: 0.5rem;
  cursor: pointer;
  min-height: 1.625rem;

  &:hover {
    ${highlighted}
  }

  ${props => props.isHighlighted && highlighted}
`;

export const SuggestionTitle = styled.span`
  margin-right: 1.5em;
`;

export const QueryColumnInfoIcon = styled(BaseQueryColumnInfoIcon)`
  padding: 0;
  margin-left: auto;
  padding: 0.3125rem 0;
`;
