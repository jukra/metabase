import type { TagDescription } from "@reduxjs/toolkit/query";

import type {
  ApiKey,
  Bookmark,
  Card,
  Collection,
  CollectionItem,
  CollectionItemModel,
  Database,
  DatabaseCandidate,
  Field,
  FieldDimension,
  FieldId,
  ForeignKey,
  Metric,
  PopularItem,
  RecentItem,
  SearchModel,
  SearchResult,
  Segment,
  Table,
  Timeline,
  TimelineEvent,
  UserInfo,
} from "metabase-types/api";
import {
  ACTIVITY_MODELS,
  COLLECTION_ITEM_MODELS,
  SEARCH_MODELS,
} from "metabase-types/api";

import type { TagType } from "./constants";
import { TAG_TYPE_MAPPING } from "./constants";

export function tag(type: TagType): TagDescription<TagType> {
  return { type };
}

export function listTag(type: TagType): TagDescription<TagType> {
  return { type, id: "LIST" };
}

export function idTag(
  type: TagType,
  id: string | number,
): TagDescription<TagType> {
  return { type, id };
}

export function invalidateTags(
  error: unknown,
  tags: TagDescription<TagType>[],
): TagDescription<TagType>[] {
  return !error ? tags : [];
}

export function provideActivityItemListTags(
  items: RecentItem[] | PopularItem[],
): TagDescription<TagType>[] {
  return [
    ...ACTIVITY_MODELS.map(model => listTag(TAG_TYPE_MAPPING[model])),
    ...items.flatMap(provideActivityItemTags),
  ];
}

export function provideActivityItemTags(
  item: RecentItem | PopularItem,
): TagDescription<TagType>[] {
  return [idTag(TAG_TYPE_MAPPING[item.model], item.model_id)];
}

export function provideApiKeyListTags(
  apiKeys: ApiKey[],
): TagDescription<TagType>[] {
  return [listTag("api-key"), ...apiKeys.flatMap(provideApiKeyTags)];
}

export function provideApiKeyTags(apiKey: ApiKey): TagDescription<TagType>[] {
  return [idTag("api-key", apiKey.id)];
}

export function provideDatabaseCandidateListTags(
  candidates: DatabaseCandidate[],
): TagDescription<TagType>[] {
  return [
    listTag("schema"),
    ...candidates.flatMap(provideDatabaseCandidateTags),
  ];
}

export function provideDatabaseCandidateTags(
  candidate: DatabaseCandidate,
): TagDescription<TagType>[] {
  return [idTag("schema", candidate.schema)];
}

export function provideDatabaseListTags(
  databases: Database[],
): TagDescription<TagType>[] {
  return [listTag("database"), ...databases.flatMap(provideDatabaseTags)];
}

export function provideDatabaseTags(
  database: Database,
): TagDescription<TagType>[] {
  return [
    idTag("database", database.id),
    ...(database.tables ? provideTableListTags(database.tables) : []),
  ];
}

export function provideBookmarkListTags(
  bookmarks: Bookmark[],
): TagDescription<TagType>[] {
  return [listTag("bookmark"), ...bookmarks.flatMap(provideBookmarkTags)];
}

export function provideBookmarkTags(
  bookmark: Bookmark,
): TagDescription<TagType>[] {
  return [
    idTag("bookmark", bookmark.id),
    idTag(TAG_TYPE_MAPPING[bookmark.type], bookmark.item_id),
  ];
}

export function provideCardListTags(cards: Card[]): TagDescription<TagType>[] {
  return [listTag("card"), ...cards.flatMap(card => provideCardTags(card))];
}

export function provideCardTags(card: Card): TagDescription<TagType>[] {
  return [
    idTag("card", card.id),
    ...(card.collection ? provideCollectionTags(card.collection) : []),
  ];
}

export function provideCollectionItemListTags(
  items: CollectionItem[],
  models: CollectionItemModel[] = Array.from(COLLECTION_ITEM_MODELS),
): TagDescription<TagType>[] {
  return [
    ...models.map(model => listTag(TAG_TYPE_MAPPING[model])),
    ...items.flatMap(provideCollectionItemTags),
  ];
}

export function provideCollectionItemTags(
  item: CollectionItem,
): TagDescription<TagType>[] {
  return [idTag(TAG_TYPE_MAPPING[item.model], item.id)];
}

export function provideCollectionTags(
  collection: Collection,
): TagDescription<TagType>[] {
  return [idTag("collection", collection.id)];
}

export function provideFieldListTags(
  fields: Field[],
): TagDescription<TagType>[] {
  return [listTag("field"), ...fields.flatMap(provideFieldTags)];
}

export function provideFieldTags(field: Field): TagDescription<TagType>[] {
  return [
    ...(typeof field.id === "number" ? [idTag("field", field.id)] : []),
    ...(field.target ? provideFieldTags(field.target) : []),
    ...(field.table ? [idTag("table", field.table.id)] : []),
    ...(field.name_field ? provideFieldTags(field.name_field) : []),
    ...(field.dimensions
      ? provideFieldDimensionListTags(field.dimensions)
      : []),
  ];
}

export function provideForeignKeyListTags(
  foreignKeys: ForeignKey[],
): TagDescription<TagType>[] {
  return [listTag("field"), ...foreignKeys.flatMap(provideForeignKeyTags)];
}

export function provideForeignKeyTags(
  foreignKey: ForeignKey,
): TagDescription<TagType>[] {
  return [
    ...(foreignKey.origin ? provideFieldTags(foreignKey.origin) : []),
    ...(foreignKey.destination ? provideFieldTags(foreignKey.destination) : []),
  ];
}

export function provideFieldDimensionListTags(
  dimensions: FieldDimension[],
): TagDescription<TagType>[] {
  return dimensions.flatMap(provideFieldDimensionTags);
}

export function provideFieldDimensionTags(
  dimension: FieldDimension,
): TagDescription<TagType>[] {
  return [
    ...(dimension.human_readable_field
      ? provideFieldTags(dimension.human_readable_field)
      : []),
  ];
}

export function provideFieldValuesTags(id: FieldId): TagDescription<TagType>[] {
  return [idTag("field-values", id)];
}

export function provideMetricListTags(
  metrics: Metric[],
): TagDescription<TagType>[] {
  return [listTag("metric"), ...metrics.flatMap(provideMetricTags)];
}

export function provideMetricTags(metric: Metric): TagDescription<TagType>[] {
  return [
    idTag("metric", metric.id),
    ...(metric.table ? provideTableTags(metric.table) : []),
  ];
}

export function provideSearchItemListTags(
  items: SearchResult[],
  models: SearchModel[] = Array.from(SEARCH_MODELS),
): TagDescription<TagType>[] {
  return [
    ...models.map(model => listTag(TAG_TYPE_MAPPING[model])),
    ...items.flatMap(provideSearchItemTags),
  ];
}

export function provideSearchItemTags(
  item: SearchResult,
): TagDescription<TagType>[] {
  return [
    idTag(TAG_TYPE_MAPPING[item.model], item.id),
    ...(item.collection ? [idTag("collection", item.collection.id)] : []),
  ];
}

export function provideSegmentListTags(
  segments: Segment[],
): TagDescription<TagType>[] {
  return [listTag("segment"), ...segments.flatMap(provideSegmentTags)];
}

export function provideSegmentTags(
  segment: Segment,
): TagDescription<TagType>[] {
  return [
    idTag("segment", segment.id),
    ...(segment.table ? provideTableTags(segment.table) : []),
  ];
}

export function provideTableListTags(
  tables: Table[],
): TagDescription<TagType>[] {
  return [listTag("table"), ...tables.flatMap(provideTableTags)];
}

export function provideTableTags(table: Table): TagDescription<TagType>[] {
  return [
    idTag("table", table.id),
    ...(table.db ? provideDatabaseTags(table.db) : []),
    ...(table.fields ? provideFieldListTags(table.fields) : []),
    ...(table.fks ? provideForeignKeyListTags(table.fks) : []),
    ...(table.segments ? provideSegmentListTags(table.segments) : []),
    ...(table.metrics ? provideMetricListTags(table.metrics) : []),
  ];
}

export function provideTimelineEventListTags(
  events: TimelineEvent[],
): TagDescription<TagType>[] {
  return [
    listTag("timeline-event"),
    ...events.flatMap(provideTimelineEventTags),
  ];
}

export function provideTimelineEventTags(
  event: TimelineEvent,
): TagDescription<TagType>[] {
  return [
    idTag("timeline-event", event.id),
    ...(event.creator ? provideUserTags(event.creator) : []),
  ];
}

export function provideTimelineListTags(
  timelines: Timeline[],
): TagDescription<TagType>[] {
  return [listTag("timeline"), ...timelines.flatMap(provideTimelineTags)];
}

export function provideTimelineTags(
  timeline: Timeline,
): TagDescription<TagType>[] {
  return [
    idTag("timeline", timeline.id),
    ...(timeline.collection ? provideCollectionTags(timeline.collection) : []),
    ...(timeline.events ? provideTimelineEventListTags(timeline.events) : []),
  ];
}

export function provideUserTags(user: UserInfo): TagDescription<TagType>[] {
  return [idTag("user", user.id)];
}
