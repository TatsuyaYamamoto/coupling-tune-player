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
