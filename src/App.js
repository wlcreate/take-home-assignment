import './App.css';
import React from "react";

function App() {
  const [textInput, setTextInput] = React.useState(`This is
a badly formatted file. This line is pretty long! It's way more than 80 characters! I feel a line wrap coming on!

This      is a second paragraph with extraneous whitespace.`);
  const [textOutput, setTextOutput] = React.useState('');
  const maximumCharacters = 80;

  const handleChange = event => {
    setTextInput(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    transformText(textInput);
  };

  const transformText = input => {
    let output = input;
    
    // normalizing space
    let normalSpacing = fixSpacing(output);
    
    // formatting with line wrapping
    output = formatLineWrap(normalSpacing);

    setTextOutput(output);
  }

  const fixSpacing = (unformattedString) => {
    let replaceSingleNewLine = unformattedString.replace(/(?<!\n)\n(?!\n)/g, " ");
    let replaceMultipleNewLines = replaceSingleNewLine.replace(/\n\n+/g, '\n\n');
    let replaceExtraSpaces = replaceMultipleNewLines.replace(/\s\s{2,}/g, " ");

    return replaceExtraSpaces;
  }

  const formatLineWrap = (normalizedSpaceString) => {
    let paragraphs = normalizedSpaceString.split(/\n\n/); // split them by paragraphs
    let updatedParagraphsArray = [];
    let lineWrappedOutput = [];

    const addWordToLine = (line, word) => {
      if (line.length !== 0) {
        line += " ";
      }
      return line += word;
    };

    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].length < maximumCharacters) {
        updatedParagraphsArray.push(paragraphs[i]);
      } else {
        let words = paragraphs[i].split(" "); // split paragraphs into individual words
        let currentLine = "";
        let paragraphWithLinesArray = [];

        for (let j = 0; j < words.length;) {
          let testIfCanAddWordToLine = addWordToLine(currentLine, words[j]);

          if (testIfCanAddWordToLine.length > maximumCharacters) {
            if (currentLine.length === 0) {
              currentLine = testIfCanAddWordToLine; // force to put at least one word on a line (i.e. when a single word is > 80)
              j++; // skip to the next word
            }
            paragraphWithLinesArray.push(currentLine); // if testIfCanAddWordToLine makes the line > 80, add the line without the word
            currentLine = "";
          } else {
            currentLine = testIfCanAddWordToLine; // if testIfCanAddWordToLine is < 80, test it next with the added word
            j++;
          }
        };

        // accounts for when a paragraph was split: 
        // no more words to add && the left over is less than 80 but has something in it -> add it as a new line
        if (currentLine.length > 0) {
          paragraphWithLinesArray.push(currentLine);
        }
        
        updatedParagraphsArray.push(paragraphWithLinesArray);
      }
    };

    for (let m = 0; m < updatedParagraphsArray.length; m++) {
      if (Array.isArray(updatedParagraphsArray[m])) {
       lineWrappedOutput.push(updatedParagraphsArray[m].join('\n')); // adds the line wrap for a paragraph
      } else {
       lineWrappedOutput.push(updatedParagraphsArray[m]);
      }
    };

    return lineWrappedOutput.join('\n\n'); // adds the space between paragraphs
  }
  
  return (
    <div className="App">
      <header>
        <h1>Career Lab | Take-Home Assignment</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          <textarea onChange={handleChange} value={textInput}/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
      <div id="result">
        {textOutput}
      </div>
    </div>
  );
}

export default App;
