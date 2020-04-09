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

export function getLongestCommonSubstring(s1: string, s2: string): string {
  const result: number[][] = [];
  for (let i = 0; i <= s1.length; i += 1) {
    result.push([]);
    for (let j = 0; j <= s2.length; j += 1) {
      let currValue = 0;
      if (i === 0 || j === 0) {
        currValue = 0;
      } else if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
        currValue = result[i - 1][j - 1] + 1;
      } else {
        currValue = Math.max(result[i][j - 1], result[i - 1][j]);
      }
      result[i].push(currValue);
    }
  }

  let i = s1.length;
  let j = s2.length;

  let s3 = "";
  while (result[i][j] > 0) {
    if (
      s1.charAt(i - 1) === s2.charAt(j - 1) &&
      result[i - 1][j - 1] + 1 === result[i][j]
    ) {
      s3 = s1.charAt(i - 1) + s3;
      i = i - 1;
      j = j - 1;
    } else if (result[i - 1][j] > result[i][j - 1]) i = i - 1;
    else j = j - 1;
  }
  return s3;
}
