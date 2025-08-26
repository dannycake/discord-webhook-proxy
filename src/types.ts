import { t } from 'elysia';

/* ---------- Embed Sub-Schemas ---------- */
const APIEmbedFooter = t.Object({
  text: t.String({ maxLength: 2048 }),
  icon_url: t.Optional(t.String()),
  proxy_icon_url: t.Optional(t.String()),
});

const APIEmbedImage = t.Object({
  url: t.Optional(t.String()),
  proxy_url: t.Optional(t.String()),
  height: t.Optional(t.Number()),
  width: t.Optional(t.Number()),
});

const APIEmbedThumbnail = t.Object({
  url: t.Optional(t.String()),
  proxy_url: t.Optional(t.String()),
  height: t.Optional(t.Number()),
  width: t.Optional(t.Number()),
});

const APIEmbedVideo = t.Object({
  url: t.Optional(t.String()),
  proxy_url: t.Optional(t.String()),
  height: t.Optional(t.Number()),
  width: t.Optional(t.Number()),
});

const APIEmbedProvider = t.Object({
  name: t.Optional(t.String()),
  url: t.Optional(t.String()),
});

const APIEmbedAuthor = t.Object({
  name: t.String({ maxLength: 256 }),
  url: t.Optional(t.String()),
  icon_url: t.Optional(t.String()),
  proxy_icon_url: t.Optional(t.String()),
});

const APIEmbedField = t.Object({
  name: t.String({ maxLength: 256 }),
  value: t.String({ maxLength: 1024 }),
  inline: t.Optional(t.Boolean()),
});

/* ---------- Main Embed Schema ---------- */
const APIEmbed = t.Object({
  title: t.Optional(t.String({ maxLength: 256 })),
  type: t.Optional(t.String()), // EmbedType: "rich" for webhooks
  description: t.Optional(t.String({ maxLength: 4096 })),
  url: t.Optional(t.String()),
  timestamp: t.Optional(t.String()),
  color: t.Optional(t.Number()),
  footer: t.Optional(APIEmbedFooter),
  image: t.Optional(APIEmbedImage),
  thumbnail: t.Optional(APIEmbedThumbnail),
  video: t.Optional(APIEmbedVideo),
  provider: t.Optional(APIEmbedProvider),
  author: t.Optional(APIEmbedAuthor),
  fields: t.Optional(t.Array(APIEmbedField, { maxItems: 25 })),
});

/* ---------- Allowed Mentions ---------- */
const APIAllowedMentions = t.Object({
  parse: t.Optional(
    t.Array(
      t.Union([t.Literal('roles'), t.Literal('users'), t.Literal('everyone')])
    )
  ),
  roles: t.Optional(t.Array(t.String())), // Snowflake[]
  users: t.Optional(t.Array(t.String())), // Snowflake[]
  replied_user: t.Optional(t.Boolean()),
});

/* ---------- Components ---------- */
// Common Button Styles
const ButtonStyle = t.Union([
  t.Literal(1), // Primary
  t.Literal(2), // Secondary
  t.Literal(3), // Success
  t.Literal(4), // Danger
  t.Literal(5), // Link
]);

// Button Component
const APIButtonComponent = t.Object({
  type: t.Literal(2), // button
  style: ButtonStyle,
  label: t.Optional(t.String({ maxLength: 80 })),
  emoji: t.Optional(
    t.Object({
      id: t.Optional(t.String()), // Snowflake
      name: t.Optional(t.String()),
      animated: t.Optional(t.Boolean()),
    })
  ),
  custom_id: t.Optional(t.String()), // required except for link buttons
  url: t.Optional(t.String()), // for link buttons only
  disabled: t.Optional(t.Boolean()),
});

// Select Option
const APISelectOption = t.Object({
  label: t.String({ maxLength: 100 }),
  value: t.String({ maxLength: 100 }),
  description: t.Optional(t.String({ maxLength: 100 })),
  emoji: t.Optional(
    t.Object({
      id: t.Optional(t.String()), // Snowflake
      name: t.Optional(t.String()),
      animated: t.Optional(t.Boolean()),
    })
  ),
  default: t.Optional(t.Boolean()),
});

// String Select
const APIStringSelectComponent = t.Object({
  type: t.Literal(3), // string select
  custom_id: t.String(),
  options: t.Array(APISelectOption, { maxItems: 25 }),
  placeholder: t.Optional(t.String({ maxLength: 150 })),
  min_values: t.Optional(t.Number()),
  max_values: t.Optional(t.Number()),
  disabled: t.Optional(t.Boolean()),
});

// Other Selects (user, role, mentionable, channel)
const APIUserSelectComponent = t.Object({
  type: t.Literal(5),
  custom_id: t.String(),
  placeholder: t.Optional(t.String({ maxLength: 150 })),
  min_values: t.Optional(t.Number()),
  max_values: t.Optional(t.Number()),
  disabled: t.Optional(t.Boolean()),
});

const APIRoleSelectComponent = t.Object({
  type: t.Literal(6),
  custom_id: t.String(),
  placeholder: t.Optional(t.String({ maxLength: 150 })),
  min_values: t.Optional(t.Number()),
  max_values: t.Optional(t.Number()),
  disabled: t.Optional(t.Boolean()),
});

const APIMentionableSelectComponent = t.Object({
  type: t.Literal(7),
  custom_id: t.String(),
  placeholder: t.Optional(t.String({ maxLength: 150 })),
  min_values: t.Optional(t.Number()),
  max_values: t.Optional(t.Number()),
  disabled: t.Optional(t.Boolean()),
});

const APIChannelSelectComponent = t.Object({
  type: t.Literal(8),
  custom_id: t.String(),
  channel_types: t.Optional(t.Array(t.Number())), // list of channel type ints
  placeholder: t.Optional(t.String({ maxLength: 150 })),
  min_values: t.Optional(t.Number()),
  max_values: t.Optional(t.Number()),
  disabled: t.Optional(t.Boolean()),
});

// Text Input
const APITextInputComponent = t.Object({
  type: t.Literal(4), // text input
  custom_id: t.String(),
  style: t.Union([t.Literal(1), t.Literal(2)]), // short = 1, paragraph = 2
  label: t.String({ maxLength: 45 }),
  min_length: t.Optional(t.Number()),
  max_length: t.Optional(t.Number()),
  required: t.Optional(t.Boolean()),
  value: t.Optional(t.String()),
  placeholder: t.Optional(t.String({ maxLength: 100 })),
});

// Action Row (container for other components)
const APIActionRowComponent = t.Object({
  type: t.Literal(1),
  components: t.Array(
    t.Union([
      APIButtonComponent,
      APIStringSelectComponent,
      APIUserSelectComponent,
      APIRoleSelectComponent,
      APIMentionableSelectComponent,
      APIChannelSelectComponent,
      APITextInputComponent,
    ])
  ),
});

// Top-level component union
const APIMessageTopLevelComponent = t.Union([APIActionRowComponent]);

/* ---------- Webhook Body Schema ---------- */
export const WebhookBody = t.Object({
  content: t.Optional(t.String({ maxLength: 2000 })),
  username: t.Optional(t.String()),
  avatar_url: t.Optional(t.String()),
  tts: t.Optional(t.Boolean()),
  embeds: t.Optional(t.Array(APIEmbed)),
  allowed_mentions: t.Optional(APIAllowedMentions),
  components: t.Optional(t.Array(APIMessageTopLevelComponent)),
  attachments: t.Optional(t.Array(t.Any())), // expand RESTAPIAttachment if needed
  flags: t.Optional(t.Number()),
  thread_name: t.Optional(t.String()),
  applied_tags: t.Optional(t.Array(t.String())), // Snowflake
  poll: t.Optional(t.Any()), // expand RESTAPIPoll if needed
});
