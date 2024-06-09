import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightSpecialChars, drawSelection, dropCursor, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, syntaxTree } from "@codemirror/language";
import { lintKeymap, linter, lintGutter } from "@codemirror/lint";
import { Linter } from "eslint-linter-browserify";
import { closeBrackets } from '@codemirror/autocomplete';

document.addEventListener('DOMContentLoaded', () => {
  const editorDiv = document.querySelector('#my-editor');

  const eslint = new Linter();

  const eslintConfig = {
    rules: {
      semi: ["error", "always"],
      "no-unused-vars": "warn",
      "no-console": "off",
      "no-return-assign": "off"
    },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    env: {
      browser: true,
      es2021: true,
    }
  };

  function eslintLinter(view) {
    const diagnostics = [];
    const text = view.state.doc.toString();
    const messages = eslint.verify(text, eslintConfig);

    let tree = syntaxTree( view.state );

    /* Do not lint if the document is empty. */
    if ( ! tree?.length ) {
      return diagnostics;
    }    

    messages.forEach(message => {
      console.log("Message:", message);
      if ( text !== '{:' ) {
        diagnostics.push({
          from: message.column - 1,
          to: message.endColumn ? message.endColumn - 1 : message.column,
          severity: message.severity === 1 ? "warning" : "error",
          message: message.message,
        });
      }
      
    });

    return diagnostics;
  }

  const myString = `// Delete the following code and start your own

if ( {:7} == 'Organization' ){
	return {:14}
} else if ( {:7} == 'Individual' ){ 
	if ({:9}=='') {
		return 'No Input yet.'
	} else {
		const a = ({:11}!='') ? ' ' + {:11} : ''
		const b = ({:8}!='') ? ' ' + {:8} : ''

		return {:9} + b + ' ' + {:10} + a
	}
} else if ( {:7} == 'Trust' ) {
	return {:15} + ' dated ' + {:16}
} else {
	return ''
}`;



  if (editorDiv) {
    const startState = EditorState.create({
      doc: myString,
      extensions: [
        keymap.of(defaultKeymap),
        javascript(),
        syntaxHighlighting(defaultHighlightStyle),
        bracketMatching(),
        highlightSpecialChars(),
        drawSelection(),
        dropCursor(),
        lineNumbers(),
        highlightActiveLine(),
        foldGutter(),
        lintGutter(),
        linter(eslintLinter),
        closeBrackets(),
        keymap.of(lintKeymap), 
        EditorView.theme({
          "&": { height: "200px", overflow: "auto" }, 
          ".cm-scroller": { overflow: "auto" } 
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorDiv
    });
  }
});