import './App.css';
import React from "react";

function App() {
  const [textInput, setTextInput] = React.useState(`This is
a badly formatted file. This line is pretty long! It's way more than 80 characters! I feel a line wrap coming on!

This      is a second paragraph with extraneous whitespace.`);
  const [textOutput, setTextOutput] = React.useState('');

  const handleChange = event => {
    setTextInput(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    transformText(textInput);
  };

  const transformText = input => {
    let output = input;
    
    // check if the user input anything
    if (output === "") {
      setTextOutput("")
    }

    // formatting space
    let replaceSingleLineBreaks = output.replace(/(?<!\n)\n(?!\n)/g, " "); // this replaces a single new line with a single space
    let replaceMultipleLineBreaks = replaceSingleLineBreaks.replace(/\n\n+/g, '\n\n'); // this replaces multiple new lines with a single space between them
    let stringNoWhiteSpace = replaceMultipleLineBreaks.replace(/\s\s{2,}/g, " "); // this removes the extraneous white space

    // formatting where to break
    // addNewLines(stringNoWhiteSpace)

    setTextOutput(addNewLines(stringNoWhiteSpace))
    // setTextOutput(output);
  }

  const addNewLines = (string) => {
    let splitString = string.split(/\n\n/) // split them by the "paragraphs"
    let addLineBreakArray = [];

    for (let i = 0; i < splitString.length; i++) {
      if (splitString[i].length < 80) {
        addLineBreakArray.push(splitString[i])
      } else {
        addLineBreakArray.push(splitString[i].match(/.{1,80}(\s|$)/g))
      }
    }

    console.log(addLineBreakArray)
    let result = []

    for (let j = 0; j < addLineBreakArray.length; j++) {
      if (Array.isArray(addLineBreakArray[j])) {
        result.push(addLineBreakArray[j].join('\n'))
      } else {
        result.push(addLineBreakArray[j])
      }
    }

    let output = result.join('\n\n')
    return(output)
  }

  // const addNewLines = (string) => {

    // let splitString = string.split("");
    // console.log(splitString)
    // let result = [];
    
    // for (let i = 0; i < splitString.length; i++) {
    //   if (splitString[i].length >= 80) {
    //     result.push(splitString[i])
    //   }
    // }

  //   let result = "";
    
  //   while (string.length > 0) {
  //     result += string.substring(0, 80) + '\n';
  //     string = string.substring(80);
  //   }

  //   return result
  // }
  
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
