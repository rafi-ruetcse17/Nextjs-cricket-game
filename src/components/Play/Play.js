import { useEffect, useState } from "react";
import styles from "./Play.module.css";
import { getMatchScore, updateMatchScore } from "@/libs/actions/matchAction";
import { useRouter } from "next/router";

const Play = ({data}) => {
  const router = useRouter();
  const matchId = router.query.matchId;
  const [error, setError] = useState(null);
  const [score, setScore] = useState(data);

  useEffect(() => {
    const teams = JSON.parse(localStorage.getItem("items"));
    const tossResult = JSON.parse(localStorage.getItem("tossResult"));
    handleTossResult({ tossResult, teams });
  }, []);

  useEffect(()=>{
    handleMatchEnd()
    handleError()
    updateDatabase()
  }, [score.balls, score.bowler, score.batsmen, score.winner])

  const handleTossResult = async ({ tossResult, teams }) => {
    if(score.secondInning) return;

    const cur = tossResult[0];
    const index = tossResult[1];
    if (!score.secondInning) {
      setScore((prev) => ({ ...prev, battingTeam: [cur, teams[index + 1]] }));
      teams.map((current, indx) => {
        if (current !== cur && typeof current === "string") {
          setScore((prev) => ({
            ...prev,
            bowlingTeam: [current, teams[indx + 1]],
          }));
        }
      });
    } else {
      setScore((prev) => ({
        ...prev,
        battingTeam: prev.bowlingTeam,
        bowlingTeam: prev.battingTeam,
      }));
    }
  };
  
  const handleScore = () => {
    setScore((prev) => ({
      ...prev,
      target: prev.runs+1,
      prev_wickets: prev.wickets,
      prev_all_batsmen: prev.all_batsmen,
      prev_all_bowlers: prev.all_bowlers,
      all_batsmen: [],
      all_bowlers: [],
      runs: 0,
      wickets: 0,
      current_status: null,
      overs: 0,
      balls: 0,
      bowler: [],
      batsmen: [],
      current_over: [],
    }));
  };

  const updateDatabase = async () => {
    await updateMatchScore(matchId, score);
  };

  const goToSummary = async () => {
    updateDatabase();
    router.push(`/match/${matchId}/summary`);
  };

  const handleMatchEnd = () =>{
    if (score.secondInning) {
      if (score.runs >= score.target && score.overs < score.overs_to_play) {
        setScore((prev) => ({ ...prev, winner: true }));
      } else if (score.overs >= score.overs_to_play || score.wickets >= 10) {
        setScore((prev) => ({ ...prev, winner: true }));
      }
    }
    if(score.winner) {
      setError(null);
      return
    }
    if(!score.secondInning && score.overs==score.overs_to_play){
      alert("First Inning Ends. Click on 'Play' to Start")
      setError(null)
    }
  }

  const handleError = () => {
    if(score.winner|| (!score.secondInning && score.overs==score.overs_to_play) ){
      setError(null);
      return
    }
    if (score.bowler.length != 1 && score.batsmen.length != 2) {
      setError("Select batsmen & bowler first...");
    } else if (score.bowler.length != 1) {
      setError("Select a bowler first...");
    } else if (score.batsmen.length != 2) {
      setError("Select batsman first...");
    } else setError(null);
  };

  const handleBatsmen = async (index) => {
    await updateDatabase();
    const res = await getMatchScore(matchId);
    setScore(res);
    if (
      score.all_batsmen.some((cur) => cur.includes(score.battingTeam[1][index]))
    ) {
      setError("This batsman is already selected!");
      return;
    }
    if (score.batsmen.length >= 2 || score.winner) {
      setError("Not Allowed!");
      return;
    }
    setScore((prev)=>{
      const batter = prev.batsmen[0];
      let batterIndex;
      prev.all_batsmen?.map((cur, ind)=>{
        if(cur[0]==batter){
          batterIndex  = ind;
        }
      })
      if (batterIndex !== undefined) {
        const updatedAllBatsmen = [...prev.all_batsmen];
        const temp = updatedAllBatsmen[batterIndex];
        updatedAllBatsmen[batterIndex] = updatedAllBatsmen[updatedAllBatsmen.length - 1];
        updatedAllBatsmen[updatedAllBatsmen.length - 1] = temp;
        return { ...prev, all_batsmen: updatedAllBatsmen };
      }
      return prev;
    })
    setScore((prev) => ({
      ...prev,
      batsmen: [...prev.batsmen, prev.battingTeam[1][index]],
      all_batsmen: [...prev.all_batsmen, [prev.battingTeam[1][index], 0]],
    }));
    
    //console.log(score);
    handleError();
  };

  const handleBowlers = async (index) => {
    await updateDatabase();
    const res = await getMatchScore(matchId);
    setScore(res);
    if (
      score.bowler.length == 1 ||
      score.all_bowlers?.at(-1)?.at(0) === score.bowlingTeam[1][index]
    ) {
      setError("You can't select this bowler!");
      return;
    }
    if (score.winner) {
      setError("Not Allowed!");
      return;
    }
    //handleError();
    setScore((prev) => ({
      ...prev,
      bowler: [...prev.bowler, prev.bowlingTeam[1][index]],
    }));
    setScore((prev) => ({
      ...prev,
      all_bowlers: [...prev.all_bowlers, [prev.bowlingTeam[1][index], 0, 0]],
    }));
  };

  const changeBatsman = () => {
    setScore((prev) => {
      const updatedBatsmen = [...prev.all_batsmen];
      const lastIndex = updatedBatsmen.length - 1;
      let changeIndex =lastIndex -1;
      if(!score.batsmen?.includes(updatedBatsmen[lastIndex-1][0]))
        changeIndex = changeIndex-1;

      [updatedBatsmen[lastIndex], updatedBatsmen[changeIndex]] = [
        updatedBatsmen[changeIndex],
        updatedBatsmen[lastIndex],
      ];
      return { ...prev, all_batsmen: updatedBatsmen };
    });
  };

  const handleBowling = async () => {
    await updateDatabase()
    const res = await getMatchScore(matchId);
    setScore(res);

    if (score.secondInning) {
      if (score.runs >= score.target && score.overs < score.overs_to_play) {
        setScore((prev) => ({ ...prev, winner: prev.battingTeam[0] }));
        return;
      } else if (score.overs >= score.overs_to_play || score.wickets >= 10) {
        setScore((prev) => ({ ...prev, winner: prev.bowlingTeam[0] }));
        return;
      }
    }
    
    const run = Math.floor(Math.random() * 8);
    run < 7
      ? setScore((prev) => ({
          ...prev,
          runs: prev.runs + run,
          current_status: run,
          balls: prev.balls + 1,
        }))
      : setScore((prev) => ({
          ...prev,
          wickets: prev.wickets + 1,
          current_status: "Wicket!",
          balls: prev.balls + 1,
          batsmen: prev.batsmen.splice(prev.batsmen.indexOf(score.all_batsmen?.at(-1)?.at(0)), 1),
        }));

    if (run < 7) {
      setScore((prev) => {
        const updatedBatsmen = [...prev.all_batsmen];
        const lastIndex = updatedBatsmen.length - 1;
        const lastBatsman = [...updatedBatsmen[lastIndex]];

        lastBatsman[1] = lastBatsman[1] + run;
        updatedBatsmen[lastIndex] = lastBatsman;

        const updatedBowlers = [...prev.all_bowlers];
        const lastIndex1 = updatedBowlers.length - 1;
        const lastBowler = [...updatedBowlers[lastIndex1]];

        lastBowler[1] = lastBowler[1] + run;
        updatedBowlers[lastIndex1] = lastBowler;

        return {
          ...prev,
          all_batsmen: updatedBatsmen,
          all_bowlers: updatedBowlers,
        };
      });

      setScore((prev) => ({
        ...prev,
        current_over: [...prev.current_over, run],
      }));
    } else {
      setScore((prev) => {
        const updatedBowlers = [...prev.all_bowlers];
        const lastIndex = updatedBowlers.length - 1;
        const lastBowler = [...updatedBowlers[lastIndex]];

        lastBowler[2] = lastBowler[2] + 1;
        updatedBowlers[lastIndex] = lastBowler;

        return { ...prev, all_bowlers: updatedBowlers };
      });
      setScore((prev) => ({
        ...prev,
        current_over: [...prev.current_over, "W"],
      }));
    }

    if (run & 1) {
      changeBatsman();
    }
    if (score.balls === 5) {
      changeBatsman();
      setScore((prev) => ({
        ...prev,
        overs: prev.overs + 1,
        balls: 0,
        bowler: [],
        current_over: [],
      }));
    }
    if (
      !score.secondInning &&
      (score.overs == score.overs_to_play || score.wickets == 10)
    ) {
      console.log(score.overs);
      setScore((prev) => ({ ...prev, secondInning: true, current_over: [] }));
      const temp = score.battingTeam;
      setScore((prev) => ({ ...prev, battingTeam: prev.bowlingTeam }));
      setScore((prev) => ({ ...prev, bowlingTeam: temp }));
      handleScore();
    }
    handleError();
  };

  return (
    <>
      <div className={styles["container-2"]}>
        <div>
          <h2>Batting Team</h2>
          <h3>{score?.battingTeam?.at(0)}</h3>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>SL.</th>
                <th>PLAYER NAME</th>
              </tr>
            </thead>
            <tbody>
              {score?.battingTeam?.at(1)?.map((cur, index) => (
                <tr key={index} onClick={() => handleBatsmen(index)}
                className={score.all_batsmen.some((batter)=>batter.includes(cur))? styles["clicked"]: styles["not-clicked"]}>
                  <td>{index + 1}</td>
                  <td>{cur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* middle elemen */}
        <div className={styles["scoreboard"]}>
          {!score.secondInning && (
            <h2 className={styles["first-innings"]}>First Innings</h2>
          )}
          {score.secondInning && (
            <h2 className={styles["second-innings"]}>Second Innings</h2>
          )}
          <h1>SCOREBOARD</h1>
          <div className={styles["separate"]}>
            <div className={styles["batting"]}>
              <h3>Batting</h3>
              <h4>
                {score.battingTeam?.at(0)} :{" "}
                <span>
                  {score.runs}/{score.wickets}
                </span>
              </h4>
              {score.all_batsmen?.length >= 1 && 
              score.batsmen.includes(score.all_batsmen.at(-1).at(0)) && (
                <p>
                  *{score.all_batsmen.at(-1).at(0)} :{" "}
                  {score.all_batsmen.at(-1).at(1)}
                </p>
              )}
              {score.all_batsmen?.length >= 2 && 
              score.batsmen.includes(score.all_batsmen.at(-2).at(0)) &&(
                <p>
                  {score.all_batsmen.at(-2).at(0)} :{" "}
                  {score.all_batsmen.at(-2).at(1)}
                </p>
              )}
              {score.all_batsmen?.length >= 3 && 
              score.batsmen.includes(score.all_batsmen.at(-3).at(0)) &&(
                <p>
                  {score.all_batsmen.at(-3).at(0)} :{" "}
                  {score.all_batsmen.at(-3).at(1)}
                </p>
              )}
            </div>
            <div className={styles["batting"]}>
              {score.current_status === "Wicket!" ? (
                <h4 className={styles["wicket"]}>Wicket!</h4>
              ) : (
                <h4 className={styles["runs"]}>{score.current_status} Runs</h4>
              )}
              <h4>
                Overs: {score.overs}.{score.balls}{" "}
              </h4>
              {score.secondInning && (
                <h4 className={styles["error"]}>
                  Target to win: {score.target}
                </h4>
              )}
            </div>
            <div className={styles["batting"]}>
              <h3>Bowling</h3>
              {score?.bowler?.length > 0 && (
                <p>
                  {score.all_bowlers.at(-1).at(0)} :
                  {score.all_bowlers.at(-1).at(1)}/
                  {score.all_bowlers.at(-1).at(2)}
                </p>
              )}
              <table>
                <thead>
                  <tr>
                    {score?.current_over?.map((cur, index) => (
                      <th key={index} className={styles["currentOver"]}>
                        {cur}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          {!score.winner && (
            <button
              className={styles["toss"]}
              onClick={
                (!score.winner &&
                  score.bowler.length === 1 &&
                  score.batsmen.length === 2) ||
                score.overs >= score.overs_to_play ||
                score.wickets == 10
                  ? handleBowling
                  : handleError
              }
            >
              Play
            </button>
          )}
          {error && <h4 className={styles["error"]}>{error}</h4>}
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
          {score.winner && <h2>Match Ends...!!!</h2>}
          {score.winner && <h4>Click to see the match summary.</h4>}
          {/* {score.winner && ( */}
          <div className={styles["summray-button"]}>
            <button
              onClick={() => {
                goToSummary();
              }}
              className={styles["summary"]}
            >
              Match Summary
            </button>
          </div>
          {/* )} */}
        </div>
        <div>
          <h2>Bowling Team</h2>
          <h3>{score.bowlingTeam[0]}</h3>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>SL.</th>
                <th>PLAYER NAME</th>
              </tr>
            </thead>
            <tbody>
              {score.bowlingTeam[1]?.map((cur, index) => (
                <tr key={index} onClick={() => handleBowlers(index)}
                className={score.bowler.includes(cur)? styles["clicked"]: styles["not-clicked"]}>
                  <td>{index + 1}</td>
                  <td>{cur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Play;