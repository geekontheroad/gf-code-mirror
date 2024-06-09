import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightSpecialChars, drawSelection, dropCursor, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, syntaxTree } from "@codemirror/language";
import { lintKeymap, linter, lintGutter } from "@codemirror/lint";
import { Linter } from "eslint-linter-browserify";

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
    console.log('text', text);
    const messages = eslint.verify(text, eslintConfig);
    console.log({messages});

    let tree = syntaxTree( view.state );

    /* Do not lint if the document is empty. */
    if ( ! tree?.length ) {
      return diagnostics;
    }    

    messages.forEach(message => {
      console.log('message', message);
      const lineStart = view.state.doc.line(message.line).from;
      const from = lineStart + message.column - 1;
      const to = message.endColumn ? lineStart + message.endColumn - 1 : from + 1;
      const errorSnippet = text.slice(from, to);

      console.log('errorSnippet', errorSnippet);
  
      // Skip diagnostics if the error snippet contains "{:"
      if (!errorSnippet.includes(':')) {
        diagnostics.push({
          from: from,
          to: to,
          severity: message.severity === 1 ? "warning" : "error",
          message: message.message,
        });
      }
    });


     // Iterate through syntax tree to catch `{:` patterns and remove diagnostics
  syntaxTree(view.state).iterate({
    enter: (type, from, to) => {
      if (type.isError) {
        const currentString = view.state.doc.sliceString(from, to);
        if (currentString.includes(':')) {
          // Remove diagnostics related to `{:` patterns
          diagnostics = diagnostics.filter(diagnostic => diagnostic.from !== from || diagnostic.to !== to);
        }
      }
    }
  });

    

    // messages.forEach(message => {
    //   const startIndex = text.split('\n').slice(0, message.line - 1).join('\n').length + message.column;
    //   const errorSnippet = text.slice(startIndex - 1, startIndex + message.message.length);

    //   console.log('startIndex', startIndex);
    //   console.log('errorSnippet', errorSnippet);
  
    //   // Skip diagnostics if the offending text contains "{:"
    //   if (!errorSnippet.includes('{:')) {
    //     const from = view.state.doc.line(message.line).from + message.column - 1;
    //     const to = message.endColumn ? view.state.doc.line(message.line).from + message.endColumn - 1 : from + 1;
  
    //     if (from !== to) {
    //       diagnostics.push({
    //         from: from,
    //         to: to,
    //         severity: message.severity === 1 ? "warning" : "error",
    //         message: message.message,
    //       });
    //     }
    //   }
    // });

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
        keymap.of(lintKeymap), 
        EditorView.theme({
          "&": { height: "200px", overflow: "auto" }, // Set fixed height and enable scrolling
          ".cm-scroller": { overflow: "auto" } // Ensure the content can scroll
        })
      ]
    });

    const view = new EditorView({
      state: startState,
      parent: editorDiv
    });
  }
});