import React from "react";

export default function About() {
  return (
    <div className='container'>
      <div className="mt-5">
        <h3>About</h3>
        <p className="lead">
          <strong>Wordle Result</strong> is a simple app to help you store your <a href='https://www.powerlanguage.co.uk/wordle/' className='normal-link' target='_blank'>Wordle</a> or <a href='https://nerdlegame.com' className='normal-link' target='_blank'>Nerdle</a> game results history.
        </p>
        <p className="lead">
          Just copy and paste the sharing text from the game, enter the word, and the date. The app can infer more data from the sharing text itself, like game number, tries and the result emojis.
        </p>
        <p className="lead">
          Example of a Wordle / Nerdle sharing text:<br/>
        </p>
        <pre style={{marginTop: '10px', background: '#EEE', padding: '20px'}}>
          Wordle 216 4/6<br/>
          <br/>
          ⬛⬛⬛🟨⬛<br/>
          🟨🟩🟩⬛🟨<br/>
          🟩🟩🟩🟩⬛<br/>
          🟩🟩🟩🟩🟩
          <br/><br/><br/>
          Nerdle 14 4/6<br/>
          <br/>
          ⬛️🟪⬛️🟪🟪🟪🟪⬛️<br/>
          🟩⬛️🟩🟪🟪🟪⬛️🟩<br/>
          🟩🟩🟩🟩🟩🟪🟩🟪<br/>
          🟩🟩🟩🟩🟩🟩🟩🟩
        </pre>
        <p className="lead">
          Your results are saved in your browser's local storage, so no account creation or any authentication is needed, just like Wordle does. But you can also import and export the results list to a JSON file for your convinience.
        </p>
        <p className="lead">
          You can also view some useful statistics based on the results data, like the number of games played, wins percentage, and the tries distribution.
        </p>
        <p className="lead">
          This is app is not affiliated with Wordle or Nerdle in any form, it's an independent tool created by a fan of those games.
        </p>
        <p className="text-center created-by mt-5 mb-4">
          Created with <span className='heart'>♥</span> in Colorado by <a href='https://cetorres.com' className='normal-link' target='_blank'>Carlos E. Torres</a>.<br />
          Send a <a className='normal-link' href='mailto:wordle-results@cetorres.com?subject=Feedback'>feedback</a>. Copyright 2022. All rights reserved.
        </p>
      </div>
    </div>
  )
}
