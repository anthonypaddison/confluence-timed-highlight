import React from 'react';
import ForgeReconciler, {
  Box,
  DatePicker,
  Inline,
  Label,
  Text,
  TextArea,
  useConfig,
  useProductContext,
  xcss,
} from '@forge/react';

import { formatExpiryDate, isHighlightActive } from '../lib/expiry.js';

const highlightStyles = xcss({
  backgroundColor: 'color.background.warning',
  borderRadius: 'radius.small',
  display: 'inline-block',
  paddingInline: 'space.050',
});

const Config = () => (
  <>
    <Label>Text</Label>
    <TextArea
      name="text"
      isRequired
      placeholder="Enter a short plain-text passage"
    />
    <Label>Expiry date</Label>
    <DatePicker
      name="expiryDate"
      isRequired
      placeholder="Select the final highlighted date"
    />
  </>
);

const App = () => {
  const config = useConfig();
  const context = useProductContext();
  const text = typeof config?.text === 'string' ? config.text.trim() : '';

  if (!text) {
    return (
      <Text as="span" color="color.text.subtle">
        Configure Timed Highlight
      </Text>
    );
  }

  const active = context
    ? isHighlightActive(config.expiryDate, { timeZone: context.timezone })
    : false;

  if (!active) {
    return <Text as="span">{text}</Text>;
  }

  const expiryLabel = formatExpiryDate(config.expiryDate, context.locale);

  return (
    <Inline alignBlock="center" space="space.050">
      <Box xcss={highlightStyles}>
        <Text as="span">{text}</Text>
      </Box>
      <Text as="span" color="color.text.subtle" size="small">
        New until {expiryLabel}
      </Text>
    </Inline>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

ForgeReconciler.addConfig(<Config />);
