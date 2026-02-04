import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "a",
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "code",
  "pre",
  "span",
  "img"
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class"];

export const sanitizeHtml = (dirty: string): string => {
  if (typeof window === "undefined") return dirty;
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR
  });
};
