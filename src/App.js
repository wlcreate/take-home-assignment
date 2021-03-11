import './App.css';
import React from "react";

function App() {
  const [textInput, setTextInput] = React.useState(`This is
a badly formatted file. This line is pretty long! It's way more than 80 characters! I feel a line wrap coming on!

This      is a second paragraph with extraneous whitespace.`);
  const [textOutput, setTextOutput] = React.useState('');
  const [margin, setMargin] = React.useState('')
  const [maxCharacters, setMaxCharacters] = React.useState(80);

  const handleChange = event => {
    setTextInput(event.target.value);
  };

  const changeMargin = event => {
    setMargin(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault();
    setMaxCharacters(maxCharacters - margin)
    transformText(textInput, margin);
  };

  const transformText = (input, margin) => {
    let output = input;
    
    // normalizing space
    let normalSpacing = fixSpacing(output);
    
    // formatting with line wrapping
    output = formatLineWrap(normalSpacing, margin);

    setTextOutput(output);
  }

  const fixSpacing = (unformattedString) => {
    let replaceSingleNewLine = unformattedString.replace(/(?<!\n)\n(?!\n)/g, " ");
    let replaceMultipleNewLines = replaceSingleNewLine.replace(/\n\n+/g, '\n\n');
    let replaceExtraSpaces = replaceMultipleNewLines.replace(/\s\s{2,}/g, " ");

    return replaceExtraSpaces;
  }

  const formatLineWrap = (normalizedSpaceString, marginNum) => {
    let paragraphs = normalizedSpaceString.split(/\n\n/); // split them by paragraphs
    let updatedParagraphsArray = [];
    let lineWrappedOutput = [];

    const addWordToLine = (line, word) => {
      if (line.length !== 0) { // this adds an extra space at the beginning of any line for paragraphs that need to be split up
        line += " ";
      }
      return line += word;
    };

    const addTopMargin = (marginNum) => { 
      return "\n".repeat(marginNum)
    }

    const addBottomMargin = (marginNum) => {
      return "\n\n" + "\n".repeat(marginNum)
    }

    const addLeftMargin = (marginNum) => {
      return " ".repeat(marginNum)
    }

    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].length < maxCharacters) {
        updatedParagraphsArray.push(addLeftMargin(marginNum) + paragraphs[i]);
      } else {
        let words = paragraphs[i].split(" "); // split paragraphs into individual words
        let currentLine = addLeftMargin(marginNum);
        let paragraphWithLinesArray = [];

        for (let j = 0; j < words.length;) {
          let testIfCanAddWordToLine = addWordToLine(currentLine, words[j]);

          if (testIfCanAddWordToLine.length > maxCharacters) {
            if (currentLine.length === 0) {
              currentLine = testIfCanAddWordToLine; // force to put at least one word on a line (i.e. when a single word is > 80)
              j++; // skip to the next word
            }
            paragraphWithLinesArray.push(currentLine); // if testIfCanAddWordToLine makes the line > 80, add the line without the word
            currentLine = addLeftMargin(marginNum);
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

    let output = lineWrappedOutput.join('\n\n'); // adds the space between paragraphs

    console.log("marginNum:", marginNum)
    console.log("topMargin:", addTopMargin(marginNum));
    console.log("bottomMargin:", addBottomMargin(marginNum));
    console.log("leftMargin:", addLeftMargin(marginNum));

    return addTopMargin(marginNum) + output + addBottomMargin(marginNum)
  }
  
  return (
    <div className="App">
      <header>
        <h1>Career Lab | Take-Home Assignment</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label>How many margins do you want to add?</label>
        <input type="number" onChange={changeMargin} value={margin}></input>
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
