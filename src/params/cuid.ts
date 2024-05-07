import type { ParamMatcher } from '@sveltejs/kit';
import { isCuid } from '@paralleldrive/cuid2';
export const match: ParamMatcher = isCuid;
