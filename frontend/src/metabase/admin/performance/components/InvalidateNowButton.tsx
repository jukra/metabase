import { t } from "ttag";

import { Form, FormProvider, FormSubmitButton } from "metabase/forms";
import { color } from "metabase/lib/colors";
import { CacheConfigApi } from "metabase/services";
import { FixedSizeIcon, Flex, Group, Icon, Loader, Text } from "metabase/ui";

export const InvalidateNowButton = ({ targetId }: { targetId: number }) => {
  const invalidateTargetDatabase = async () => {
    await CacheConfigApi.invalidate({ database: targetId }, { hasBody: false });
  };

  return (
    <div
      style={{ position: "absolute", top: ".5rem", insetInlineEnd: ".5rem" }}
    >
      <FormProvider initialValues={{}} onSubmit={invalidateTargetDatabase}>
        <Form>
          <FormSubmitButton
            style={{ alignSelf: "flex-start" }}
            label={
              <Flex gap="sm">
                <FixedSizeIcon color={color("danger")} name="trash" />
                Invalidate now
              </Flex>
            }
            activeLabel={<Loader size="xs" />}
            successLabel={
              <Text fw="bold" lh="1" color="success">
                <Group spacing="xs">
                  <Icon name="check" /> {t`Invalidated`}
                </Group>
              </Text>
            }
          />
        </Form>
      </FormProvider>
    </div>
  );
};
