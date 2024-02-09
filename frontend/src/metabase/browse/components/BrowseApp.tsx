import { t } from "ttag";
import { push } from "react-router-redux";
import { useState } from "react";
import { Flex, Icon, Switch, Text } from "metabase/ui";
import {
  useDatabaseListQuery,
  useSearchListQuery,
} from "metabase/common/hooks";
import type { SearchResult } from "metabase-types/api";
import { useDispatch } from "metabase/lib/redux";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import Link from "metabase/core/components/Link";
import { isValidBrowseTab, type BrowseTabId } from "../utils";
import { BrowseDatabases } from "./BrowseDatabases";
import { BrowseModels } from "./BrowseModels";
import {
  BrowseAppRoot,
  BrowseContainer,
  BrowseDataHeader,
  BrowseTab,
  BrowseTabs,
  BrowseTabsList,
  BrowseTabsPanel,
} from "./BrowseApp.styled";
import { BrowseHeaderIconContainer } from "./BrowseHeader.styled";
import {isInstanceAnalyticsCollection} from "metabase/collections/utils";
import {PLUGIN_SELECTORS} from "metabase/plugins";

export const BrowseApp = ({
  tab,
  children,
}: {
  tab: BrowseTabId;
  children?: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const modelsResult = useSearchListQuery<SearchResult>({
    query: {
      models: ["dataset"],
      filter_items_in_personal_collection: "exclude",
    },
  });
  const databasesResult = useDatabaseListQuery();

  if (!isValidBrowseTab(tab)) {
    return <LoadingAndErrorWrapper error />;
  }

  // TODO: Perhaps put possibleFilters and activeFilters into the plugin system
  const possibleFilters = {
    'omitInstanceAnalytics': (model: SearchResult) => !isInstanceAnalyticsCollection(model.collection),
    ...useSelector(PLUGIN_SELECTORS.browseFilters)
  }

  const [filters, setFilters] = useState(initialFilters);

  return (
    <BrowseAppRoot data-testid="browse-app">
      <BrowseContainer>
        <BrowseDataHeader>
          <Flex maw="1014px" m="0 auto" w="100%" align="center">
            <h2>{t`Browse data`}</h2>
          </Flex>
        </BrowseDataHeader>
        <BrowseTabs
          value={tab}
          onTabChange={value => {
            if (isValidBrowseTab(value)) {
              dispatch(push(`/browse/${value}`));
            }
          }}
        >
          <BrowseTabsList>
            <Flex maw="1014px" m="0 auto" w="100%" align="center">
              <BrowseTab key={"models"} value={"models"}>
                {t`Models`}
              </BrowseTab>
              <BrowseTab key={"databases"} value={"databases"}>
                {t`Databases`}
              </BrowseTab>
              {tab === "models" ? (
                <ToggleOnlyShowVerifiedModels />
              ) : (
                <Flex ml="auto" justify="right" style={{ flexBasis: "40.0%" }}>
                  <Link to="reference">
                    <BrowseHeaderIconContainer>
                      <Icon size={14} name="reference" />
                      <Text size="md" lh="1" fw="bold" ml=".5rem" c="inherit">
                        {t`Learn about our data`}
                      </Text>
                    </BrowseHeaderIconContainer>
                  </Link>
                </Flex>
              )}
            </Flex>
          </BrowseTabsList>
          <BrowseTabsPanel key={tab} value={tab}>
            <Flex
              maw="1014px"
              m="0 auto"
              w="100%"
              align="center"
              direction="column"
              justify="flex-start"
            >
              <BrowseTabContent
                tab={tab}
                modelsResult={modelsResult}
                databasesResult={databasesResult}
                filters={filters}
              >
                {children}
              </BrowseTabContent>
            </Flex>
          </BrowseTabsPanel>
        </BrowseTabs>
      </BrowseContainer>
    </BrowseAppRoot>
  );
};

const BrowseTabContent = ({
  tab,
  children,
  modelsResult,
  databasesResult,
  onlyShowVerifiedModels,
}: {
  tab: BrowseTabId;
  children?: React.ReactNode;
  modelsResult: ReturnType<typeof useSearchListQuery<SearchResult>>;
  databasesResult: ReturnType<typeof useDatabaseListQuery>;
  onlyShowVerifiedModels: boolean;
}) => {
  if (children) {
    return <>{children}</>;
  }
  if (tab === "models") {
    return (
      <BrowseModels
        modelsResult={modelsResult}
        onlyShowVerifiedModels={onlyShowVerifiedModels}
      />
    );
  } else {
    return <BrowseDatabases databasesResult={databasesResult} />;
  }
};

export const ToggleOnlyShowVerifiedModels = () => {
  const [onlyShowVerifiedModels, setOnlyShowVerifiedModels] = useState(
    localStorage.getItem("onlyShowVerifiedModelsInBrowseData") !== "false",
  );

  const changeOnlyShowVerifiedModels = (newValue: boolean) => {
    localStorage.setItem(
      "onlyShowVerifiedModelsInBrowseData",
      newValue ? "true" : "false",
    );
    setOnlyShowVerifiedModels(newValue);
  };

  return (
    <Switch
      ml="auto"
      size="sm"
      labelPosition="left"
      checked={onlyShowVerifiedModels}
      label={<strong>{t`Only show verified models`}</strong>}
      onChange={e => {
        changeOnlyShowVerifiedModels(e.target.checked);
      }}
    />
  );
};
