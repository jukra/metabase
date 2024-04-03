import type { MantineThemeOverride } from "@mantine/core";
import { rem } from "@mantine/core";

import {
  getAccordionOverrides,
  getActionIconOverrides,
  getAnchorOverrides,
  getAutocompleteOverrides,
  getButtonOverrides,
  getCalendarOverrides,
  getCardOverrides,
  getCheckboxOverrides,
  getDateInputOverrides,
  getDatePickerOverrides,
  getDividerOverrides,
  getFileInputOverrides,
  getHoverCardOverrides,
  getInputOverrides,
  getMenuOverrides,
  getModalOverrides,
  getNavLinkOverrides,
  getMultiSelectOverrides,
  getRadioOverrides,
  getPaperOverrides,
  getPopoverOverrides,
  getSegmentedControlOverrides,
  getSelectOverrides,
  getScrollAreaOverrides,
  getSwitchOverrides,
  getTabsOverrides,
  getTextareaOverrides,
  getTextInputOverrides,
  getTextOverrides,
  getTimeInputOverrides,
  getTitleOverrides,
  getTooltipOverrides,
  getListOverrides,
} from "./components";
import { getThemeColors } from "./utils/colors";

export const getThemeOverrides = (): MantineThemeOverride => ({
  breakpoints: {
    xs: "23em",
    sm: "40em",
    md: "60em",
    lg: "80em",
    xl: "120em",
  },
  colors: getThemeColors(),
  primaryColor: "brand",
  primaryShade: 0,
  shadows: {
    sm: "0px 1px 4px 2px rgba(0, 0, 0, 0.08)",
    md: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    xl: "40px",
  },
  fontSizes: {
    xs: rem(11),
    sm: rem(12),
    md: rem(14),
    lg: rem(17),
    xl: rem(21),
  },
  lineHeight: "1rem",
  headings: {
    sizes: {
      h1: {
        fontSize: rem(24),
        lineHeight: rem(24),
      },
      h2: {
        fontSize: rem(20),
        lineHeight: rem(24),
      },
      h3: {
        fontSize: rem(14),
        lineHeight: rem(16),
      },
      h4: {
        fontSize: rem(14),
        lineHeight: rem(16),
      },
    },
  },
  fontFamily: "var(--default-font-family)",
  fontFamilyMonospace: "Monaco, monospace",
  focusRingStyles: {
    styles: theme => ({
      outline: `${rem(2)} solid ${theme.colors.focus[0]}`,
      outlineOffset: rem(2),
    }),
  },
  components: {
    ...getAccordionOverrides(),
    ...getActionIconOverrides(),
    ...getAnchorOverrides(),
    ...getAutocompleteOverrides(),
    ...getButtonOverrides(),
    ...getCalendarOverrides(),
    ...getCardOverrides(),
    ...getCheckboxOverrides(),
    ...getDateInputOverrides(),
    ...getDatePickerOverrides(),
    ...getDividerOverrides(),
    ...getFileInputOverrides(),
    ...getInputOverrides(),
    ...getMenuOverrides(),
    ...getModalOverrides(),
    ...getMultiSelectOverrides(),
    ...getNavLinkOverrides(),
    ...getRadioOverrides(),
    ...getPaperOverrides(),
    ...getPopoverOverrides(),
    ...getScrollAreaOverrides(),
    ...getSegmentedControlOverrides(),
    ...getSelectOverrides(),
    ...getSwitchOverrides(),
    ...getTabsOverrides(),
    ...getTextareaOverrides(),
    ...getTextInputOverrides(),
    ...getTextOverrides(),
    ...getTimeInputOverrides(),
    ...getTitleOverrides(),
    ...getTooltipOverrides(),
    ...getHoverCardOverrides(),
    ...getListOverrides(),
  },
});
