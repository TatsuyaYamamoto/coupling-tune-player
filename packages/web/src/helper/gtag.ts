export const GA_TRACKING_ID = "<YOUR_GA_TRACKING_ID>";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  (window as any).gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

export type EventAction = "click";

export interface EventParams {
  category: "player" | "info" | "link";
  label?: string | number;
  value?: string | number;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export function sendEvent(
  name: EventAction,
  params: EventParams,
  nonInteraction: boolean = false
) {
  (window as any).gtag("event", name, {
    event_category: params.category,
    label: params.label,
    value: params.value,
    non_interaction: nonInteraction,
  });
}
