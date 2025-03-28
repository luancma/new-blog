import { messages } from "./default";

export enum MessageKeys {
  BLOG_TITLE = "BLOG_TITLE",
  BLOG_DESCRIPTION = "BLOG_DESCRIPTION",
  BLOG_SUB_DESCRIPTION = "BLOG_SUB_DESCRIPTION",
}

export const geHomePageMessages = (key: MessageKeys) => {
  return messages.HOMEPAGE[key];
};
