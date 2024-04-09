import cx from "classnames";
import { useEffect, useRef, useCallback, type RefObject } from "react";
import _ from "underscore";

import { HoverParent } from "metabase/components/MetadataInfo/ColumnInfoIcon";
import CS from "metabase/css/core/index.css";
import { color } from "metabase/lib/colors";
import { isObscured } from "metabase/lib/dom";
import { DelayGroup, Icon, type IconName } from "metabase/ui";
import type * as Lib from "metabase-lib";
import type { Suggestion } from "metabase-lib/v1/expressions/suggest";

import {
  ExpressionListItem,
  ExpressionList,
  ExpressionPopover,
  SuggestionSpanContent,
  SuggestionSpanRoot,
  SuggestionTitle,
  QueryColumnInfoIcon,
} from "./ExpressionEditorSuggestions.styled";

// eslint-disable-next-line import/no-default-export
export default function ExpressionEditorSuggestions({
  query,
  stageIndex,
  suggestions,
  onSuggestionMouseDown,
  highlightedIndex,
  target,
}: {
  query: Lib.Query;
  stageIndex: number;
  suggestions: Suggestion[];
  onSuggestionMouseDown: (index: number) => void;
  highlightedIndex: number;
  target: RefObject<HTMLElement>;
}) {
  if (!suggestions.length || !target) {
    return null;
  }

  return (
    <DelayGroup>
      <ExpressionPopover
        placement="bottom-start"
        sizeToFit
        visible
        reference={target}
        zIndex={300}
        content={
          <ExpressionList
            data-testid="expression-suggestions-list"
            className={CS.pb1}
          >
            {suggestions.map((suggestion: Suggestion, idx: number) => (
              <ExpressionEditorSuggestionsListItem
                key={`suggesion-${idx}`}
                query={query}
                stageIndex={stageIndex}
                suggestion={suggestion}
                isHighlighted={idx === highlightedIndex}
                index={idx}
                onSuggestionMouseDown={onSuggestionMouseDown}
              />
            ))}
          </ExpressionList>
        }
      />
    </DelayGroup>
  );
}

function ExpressionEditorSuggestionsListItem({
  query,
  stageIndex,
  suggestion,
  isHighlighted,
  index,
  onSuggestionMouseDown,
}: {
  query: Lib.Query;
  stageIndex: number;
  index: number;
  suggestion: Suggestion;
  isHighlighted: boolean;
  onSuggestionMouseDown: (index: number) => void;
}) {
  const { icon } = suggestion;
  const { normal, highlighted } = colorForIcon(icon);

  const ref = useRef<HTMLLIElement>(null);
  useEffect(
    function () {
      if (!isHighlighted || !ref.current || !isObscured(ref.current)) {
        return;
      }

      ref.current.scrollIntoView({ block: "nearest" });
    },
    [isHighlighted],
  );

  const handleMouseDownCapture = useCallback(
    function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (event.target.tagName === "A" || event.target.tagName === "BUTTON") {
        return;
      }

      onSuggestionMouseDown?.(index);
    },
    [index, onSuggestionMouseDown],
  );

  return (
    <HoverParent>
      <ExpressionListItem
        ref={ref}
        onMouseDownCapture={handleMouseDownCapture}
        isHighlighted={isHighlighted}
        className={cx(CS.hoverParent, CS.hoverInherit)}
        data-ignore-outside-clicks
        data-testid="expression-suggestions-list-item"
      >
        {icon && (
          <Icon
            name={icon as IconName}
            color={isHighlighted ? highlighted : normal}
            className={CS.mr1}
            data-ignore-outside-clicks
          />
        )}
        <SuggestionTitle data-ignore-outside-clicks>
          <SuggestionSpan
            suggestion={suggestion}
            isHighlighted={isHighlighted}
            data-ignore-outside-clicks
          />
        </SuggestionTitle>
        {suggestion.column && (
          <QueryColumnInfoIcon
            query={query}
            stageIndex={stageIndex}
            column={suggestion.column}
            position="right"
          />
        )}
      </ExpressionListItem>
    </HoverParent>
  );
}

function SuggestionSpan({
  suggestion,
  isHighlighted,
}: {
  suggestion: Suggestion;
  isHighlighted: boolean;
}) {
  return !isHighlighted && suggestion.range ? (
    <SuggestionSpanRoot>
      {suggestion.name.slice(0, suggestion.range[0])}
      <SuggestionSpanContent isHighlighted={isHighlighted}>
        {suggestion.name.slice(suggestion.range[0], suggestion.range[1])}
      </SuggestionSpanContent>
      {suggestion.name.slice(suggestion.range[1])}
    </SuggestionSpanRoot>
  ) : (
    <>{suggestion.name}</>
  );
}

function colorForIcon(icon: string | undefined | null) {
  switch (icon) {
    case "segment":
      return { normal: color("accent2"), highlighted: color("brand-white") };
    case "insight":
      return { normal: color("accent1"), highlighted: color("brand-white") };
    case "function":
      return { normal: color("brand"), highlighted: color("brand-white") };
    default:
      return {
        normal: color("text-medium"),
        highlighted: color("brand-white"),
      };
  }
}
