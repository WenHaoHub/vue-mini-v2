import { parseHTML } from "./html-parser.js";
function genprops(attr) {
  let str = "";
  for (let i = 0; i < attr.length; i++) {
    const item = attr[i];
    if (item.name === "style") {
      let obj = {};
      item.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key] = value;
      });
      item.value = obj;
    }
    str += `${item.name}:${JSON.stringify(item.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
function genChildren(children) {
  return children.map((child) => {
    return gen(child);
    // let arr = gen(child);
    // return arr.length > 0 ? arr.join(",") : arr;
  });
}
let defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function gen(node) {
  if (node.type == 1) {
    return codegen(node);
  } else {
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = [];
      let match, index;
      defaultTagRE.lastIndex = 0;
      while ((match = defaultTagRE.exec(text))) {
        let lastIndex = match.index;
        if (lastIndex > index) {
          tokens.push(JSON.stringify(text.slice(index, lastIndex)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        index = lastIndex + match[0].length;
      }
      if (index < text.length) {
        tokens.push(JSON.stringify(text.slice(index)));
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}
function codegen(ast) {
  let children = genChildren(ast.children);
  let code = `_c('${ast.tag}',${
    ast.attr.length > 0 ? genprops(ast.attr) : "null"
  }${ast.children.length ? `,${children}` : ""})`;
  //   console.log(">>>code", code, children);
  return code;
}
export function compileToFunction(html) {
  let ast = parseHTML(html);
  console.log(">>>ast", ast);

  let code = codegen(ast);
  /**
    with(this){
    return _c(
            "div",
            { id: "app", key: "#app" },
            _c("p", { key: "p1" }, _v("hello")),
            _c("p", { key: "p2", style: { color: "red" } }, _v(_s(message)))
          );
    }
  */
  code = `with(this){return ${code}}`;
  //   let render = new Function("_c", "Vue", code)(createElement, Vue);
  let render = new Function(code);
  //   console.log('>>>',render.toString());
  return render;
  //   console.log(">>>codegen", codegen(ast));
  // render(h){
  //     h
  // }
}


