import { parse, ParseOptions, renderAST } from "./ast";
import { renderHTML } from "./html";

let n = 500;

let deeplynested : string[] = [];
for (let i=0; i < n; i++) {
  deeplynested[i] = " ".repeat(i+1) + "* a\n";
}

let backticks : string[] = [];
for (let i=0; i < 5 * n; i++) {
  backticks[i] = "e" + "`".repeat(i+1);
}

let tests : Record<string, string> = {
  ["nested strong emph"]:
    "_a *a ".repeat(65*n) + "b" + " a* a_".repeat(65*n),
  ["many emph closers with no openers"]:
    "a_ ".repeat(65*n),
  ["many emph openers with no closers"]:
    "_a ".repeat(65*n),
  ["many link closers with no openers"]:
    "a]".repeat(65*n),
  ["many link openers with no closers"]:
    "[a".repeat(65*n),
  ["mismatched openers and closers"]:
    "*a_ ".repeat(50*n),
  ["issue cmark#389"]:
    "*a ".repeat(20*n) + "_a*_ ".repeat(20*n),
  ["openers and closers multiple of 3"]:
    "a**b" + "8* ".repeat(50 * n),
  ["link openers and emph closers"]:
    "[ a_".repeat(50 * n),
  ["pattern [ (]( repeated"]:
    "[ (](".repeat(80 * n),
  ["nested brackets"]:
    "[".repeat(50 * n) + "a" + "]".repeat(50*n),
  ["nested block quotes"]:
    "> ".repeat(50*n) + "a",
  ["deeply nested lists"]:
    deeplynested.join(""),
  ["backticks"]:
    backticks.join(""),
  ["unclosed links"]:
    "[a](<b".repeat(30 * n),
  ["unclosed attributes"]:
    "a{#id k=".repeat(30 * n),
};

describe("Pathological tests", () => {
  for (let testname in tests) {
    it("does not exhibit pathological behavior on " + testname, () => {
      let test : string = tests[testname];
      setTimeout(() => {
        let ast = parse(test, {});
        expect(ast).toBeTruthy();
      }, 1000).unref();
    });
  }
});
