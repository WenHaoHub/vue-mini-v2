import babel from "rollup-plugin-babel";
module.exports = [
  {
    input: "./src/index.js",
    output:  {
       file: "./dist/vue.js",
      format: "umd",
      name: "Vue", // umd模块名称，相当于一个命名空间，会自动挂载到window下面
      sourcemap: true,
    },
    plugins: [
      babel({
        exclude: "node_modules/**", // 只编译我们的源代码
      }),
    ],
  },
];
