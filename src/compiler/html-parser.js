/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson (MPL-1.1 OR Apache-2.0 OR GPL-2.0-or-later)
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性匹配
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签
const startTagClose = /^\s*(\/?)>/; //匹配结束标签;
var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{xxx}}
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

// Special Elements (can contain anything)
const reCache = {};

const decodingMap = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&amp;": "&",
  "&#10;": "\n",
  "&#9;": "\t",
  "&#39;": "'",
};
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

// #5992
const shouldIgnoreFirstNewline = (tag, html) =>
  tag && isIgnoreNewlineTag(tag) && html[0] === "\n";

export function parseHTML(html, options) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 3;
  const stack = [];
  let index = 0;
  let root;
  let currentParent;
  function createAST(tag, attr) {
    return {
      tag,
      attr,
      type: ELEMENT_TYPE,
      children: [],
      parent: null,
    };
  }

  function start(tag, attr) {
    let node = createAST(tag, attr);
    //空就是当前树的根节点
    if (!root) {
      root = node;
    }
    if (currentParent) {
      node.parent = currentParent;
      currentParent.children.push(node);
    }
    currentParent = node; //执行栈中最后一个
    stack.push(node);
  }
  function chars(text) {
    //删除空文本
    text = text.replace(/^\s+|\s+$/g, "");
    if (text) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text,
      });
    }
  }
  function end(tag) {
    stack.pop(); //弹出最后一个标签tag
    currentParent = stack[stack.length - 1];
  }
  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  //判断是否是开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
        start: index,
      };
      advance(start[0].length); // 将匹配到的字符串去掉
      let end, attr;
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(dynamicArgAttribute) || html.match(attribute))
      ) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
    return false;
  }

  while (html) {
    let textEnd = html.indexOf("<"); // 找到第一个<的位置
    if (textEnd === 0) {
      // Start tag:
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(startTagMatch.tagName);
        continue;
      }
    }
    if (textEnd > 0) {
      // 文本
      const text = html.substring(0, textEnd);
      if (text) {
        chars(text);
        advance(text.length);
      }
    }
  }
  return root;

  // console.log(">>>root", root);
  // Clean up any remaining tags
  // parseEndTag();
}
