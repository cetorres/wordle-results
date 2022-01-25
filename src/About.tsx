import React from "react";

export default function About() {
  return (
    <div className='container'>
      <div className="mt-5">
        <h3>About</h3>
        <p className="lead">
          <strong>Wordle Result</strong> is a simple app to help you store your <a href='https://www.powerlanguage.co.uk/wordle/' rel="noreferrer" target='_blank'>Wordle</a> game results history.
        </p>
        <p className="lead">
          Just copy and paste the sharing text from the game, enter the word, and the date. The app can infer more data from the sharing text itself, like game number, tries and the result emojis.
        </p>
        <p className="lead">
          Example of a Wordle sharing text:<br/>
          <pre style={{marginTop: '10px', background: '#EEE', padding: '20px'}}>
            Wordle 216 4/6<br/>
            <br/>
            ⬛⬛⬛🟨⬛<br/>
            🟨🟩🟩⬛🟨<br/>
            🟩🟩🟩🟩⬛<br/>
            🟩🟩🟩🟩🟩
          </pre>
        </p>
        <p className="lead">
          Your results are saved in your browser's local storage, so no account creation or any authentication is needed, just like Wordle does. But you can also import and export the results list to a JSON file for your convinience.
        </p>
        <p className="lead">
          You can also view some useful statistics based on the results data, like the number of games played, wins percentage, and the tries distribution.
        </p>
        <p className="lead">
          This is app is not affiliated with Wordle in any form, it's an independent tool created by a fan of Wordle.
        </p>
        <p className="text-center mt-5">
          Created with ❤️ in Colorado by <a href='https://cetorres.com' rel="noreferrer" target='_blank'>Carlos E. Torres</a>.<br />
          Copyright 2022. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
