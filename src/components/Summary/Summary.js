import React, { useState } from "react";
import styles from "./Summary.module.css";

const Summary = ({data}) => {
  const [score, setScore] = useState(data);
  const batsmenArray = [];
  const bowlersArray = [];

  score.prev_all_batsmen?.forEach((cur) => {
    batsmenArray.push(cur?.at(0));
  });
  score.all_batsmen?.forEach((cur) => {
    bowlersArray.push(cur?.at(0));
  });

  if (!score) return;
  return (
    <div className={styles["main"]}>
      <h1>Match Summary</h1>
      <div className={styles["container"]}>
        <div>
          {score.secondInning?<h2>{score.bowlingTeam?.at(0)}</h2>: <h2>{score.battingTeam?.at(0)}</h2> }
          <table className={styles["table-1"]}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Run</th>
              </tr>
            </thead>
            <tbody>
             {!score.secondInning && score.all_batsmen?.map((cur, index) => (
                <tr key={index}>
                  <td>{cur?.at(0)}</td>
                  <td>{cur?.at(1)}</td>
                </tr>
              ))}
              {!score.secondInning && score.battingTeam?.at(1)?.map(
                (cur, index) =>
                  !bowlersArray.includes(cur) && (
                    <tr key={index}>
                      <td>{cur}</td>
                      <td>Not Out</td>
                    </tr>
                  )
              )}
              {score.secondInning && score.prev_all_batsmen?.map((cur, index) => (
                <tr key={index}>
                  <td>{cur?.at(0)}</td>
                  <td>{cur?.at(1)}</td>
                </tr>
              ))}
              {score.secondInning && score.bowlingTeam?.at(1)?.map(
                (cur, index) =>
                  !batsmenArray.includes(cur) && (
                    <tr key={index}>
                      <td>{cur}</td>
                      <td>Not Out</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
          {score.target ? (
            <h3>
              {score.bowlingTeam?.at(0)} Total : {score.target - 1}/
              {score.prev_wickets}
            </h3>
          ) : (
            <h3>{score.battingTeam?.at(0)} Total : {score.runs}/{score.wickets}</h3>
          )}
          {score.secondInning && score.prev_all_bowlers?.map((cur, index) => (
            <p key={index}>
              {cur?.at(0)} : {cur?.at(1)}/{cur?.at(2)}
            </p>
          ))}
          {!score.secondInning && score.all_bowlers?.map((cur, index) => (
            <p key={index}>
              {cur?.at(0)} : {cur?.at(1)}/{cur?.at(2)}
            </p>
          ))}
        </div>

        <div>
          {score.winner && score.runs >= score.target && (
            <h3 className={styles["winner"]}>
              {score.battingTeam[0]} win by {10 - score.wickets} wickets!
            </h3>
          )}
          {score.winner && score.runs < score.target - 1 && (
            <h3 className={styles["winner"]}>
              {score.bowlingTeam[0]} win by {score.target - 1 - score.runs}{" "}
              runs!
            </h3>
          )}
          {score.winner && score.runs === score.target - 1 && (
            <h3 className={styles["winner"]}>Match is Draw!</h3>
          )}
        </div>

        <div>
        {!score.secondInning?<h2>{score.bowlingTeam?.at(0)}</h2>: <h2>{score.battingTeam?.at(0)}</h2>}
          <table className={styles["table-1"]}>
            <thead>
              <tr>
                <th>Player</th>
                <th>Run</th>
              </tr>
            </thead>
            <tbody>
              {score.secondInning && score.all_batsmen?.map((cur, index) => (
                <tr key={index}>
                  <td>{cur?.at(0)}</td>
                  <td>{cur?.at(1)}</td>
                </tr>
              ))}
              {score.secondInning && score.battingTeam?.at(1)?.map(
                (cur, index) =>
                  !bowlersArray.includes(cur) && (
                    <tr key={index}>
                      <td>{cur}</td>
                      <td>Not Out</td>
                    </tr>
                  )
              )}
              {!score.secondInning && score.bowlingTeam?.at(1)?.map((cur, index)=>(
                <tr key={index}>
                <td>{cur}</td>
                <td>Not Out</td>
              </tr>
              ))}
            </tbody>
          </table>
          {score.secondInning ? <h3>{score.battingTeam?.at(0)} Total : {score.runs}/{score.wickets}</h3>:
            <h3>{score.bowlingTeam?.at(0)} : Not Batted Yet!</h3>
          }
          
          {score.secondInning && score.all_bowlers?.map((cur, index) => (
            <p key={index}>
              {cur?.at(0)} : {cur?.at(1)}/{cur?.at(2)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Summary;
