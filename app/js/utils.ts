export function goTo(href: string): void {
  window.location.href = href;
}

const TWITTER_INTENT_ENDPOINT = "https://twitter.com/intent/tweet";
let WindowObjectReference: Window | null = null;

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
interface WebIntentParams {
  text?: string;
  url?: string;
  hashtags?: string[];
  via?: string;
}

/**
 * @see https://dev.twitter.com/web/tweet-button/web-intent
 */
export function tweetByWebIntent(params: WebIntentParams) {
  const queries: string[] = [];

  if (params.hashtags) {
    queries.push(`hashtags=${encodeURIComponent(params.hashtags.join(","))}`);
  }
  if (params.text) {
    queries.push(`text=${encodeURIComponent(params.text)}`);
  }
  if (params.url) {
    queries.push(`url=${encodeURIComponent(params.url)}`);
  }
  if (params.via) {
    queries.push(`via=${encodeURIComponent(params.via)}`);
  }

  const intentUrl = `${TWITTER_INTENT_ENDPOINT}?${queries.join("&")}`;

  if (!WindowObjectReference || WindowObjectReference.closed) {
    WindowObjectReference = window.open(intentUrl, "TwitterIntentWindowName");
  } else {
    WindowObjectReference.focus();
  }
}

type EventAction = "click";

interface EventParams {
  category: "player" | "info" | "link";
  label?: string | number;
  value?: string | number;
}

export function sendEvent(
  name: EventAction,
  params: EventParams,
  nonInteraction: boolean = false
) {
  (window as any).gtag("event", name, {
    event_category: params.category,
    label: params.label,
    value: params.value,
    non_interaction: nonInteraction
  });
}
