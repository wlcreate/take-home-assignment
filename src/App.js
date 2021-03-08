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

    let replaceSingleLineBreaks = output.replace(/(?<!\n)\n(?!\n)/g, " "); // this replaces a single new line with a single space
    let replaceMultipleLineBreaks = replaceSingleLineBreaks.replace(/\n\n+/g, '\n\n'); // this replaces multiple new lines with a single space between them
    let stringNoWhiteSpace = replaceMultipleLineBreaks.replace(/\s\s{2,}/g, " "); // this removes the extraneous white space


    setTextOutput(stringNoWhiteSpace)
    // setTextOutput(output);
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
