import { defineEventHandler, setResponseHeader } from 'h3';
import { isIndexable } from '../site';

/** Keeps previews and provider URLs out of search results, even when a crawler ignores robots.txt. */
export default defineEventHandler((event) => {
  if (!isIndexable(event)) setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
});
