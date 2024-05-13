import React, { useState } from "react";
import styles from "./Home.module.css";
import { useRouter } from "next/router";
import { createMatchScore } from "@/libs/actions/matchAction";

const Home = ({ tableData }) => {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOver, setSelectedOver] = useState(1);
  
  const [score, setScore] = useState({
    runs: 0,
    wickets: 0,
    current_status: null,
    overs: 0,
    balls: 0,
    overs_to_play:1,
    bowler: [],
    batsmen: [],
    battingTeam: [],
    bowlingTeam: [],
    all_batsmen: [],
    all_bowlers: [],
    prev_all_batsmen: [],
    prev_all_bowlers: [],
    prev_wickets: null,
    target: null,
    winner: null,
    secondInning: false,
    current_over: []
  });

  const handleChange = (e) => {
    setSelectedOver(e.target.value);
    setScore((prev)=>({...prev, overs_to_play: e.target.value}))
  };

  const handleClick = (country, players) => {
    if (items.length === 4 && !items.includes(country)) {
      setError("You can't select more than two countries!");
      return;
    }
    if (items.includes(country)) {
      const id = items.indexOf(country);
      setItems((prevItems) => {
        const updatedItems = prevItems.filter(
          (item, index) => item !== country && index != id + 1
        );
        return updatedItems;
      });
    } else if (!items.includes(country) || !items.includes(players)) {
      setItems([...items, country, players]);
    }
    setError(null);
  };
  const handleSubmit = async() => {
    localStorage.setItem("items", JSON.stringify(items));
    const matchId = await createMatchScore(score);
    console.log(matchId);
    router.push(`/match/${matchId}/toss`);
  };

  return (
    <div>
      <div className={styles["container"]}>
        <div className={styles["center-elements"]}>
          <h1>Welcome to Virtual Cricket Game</h1>
          <table className={styles["table"]}>
            <thead>
              <tr>
                <th>Pos</th>
                <th>Teams</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((cur) => (
                <tr
                  key={cur.pos}
                  onClick={() => handleClick(cur.name, cur.players)}
                  className={items.includes(cur.name) ? styles["clicked"] : ""}
                >
                  <td>{cur.pos}</td>
                  <td>{cur.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4> Click on Any Two TEAMS to play....</h4>

          {items.length > 0 && (
            <div className={styles["selected-teams"]}>
              Selected teams:{" "}
              {items.map(
                (cur, index) =>
                  typeof cur === "string" && <span key={index}>{cur} </span>
              )}
            </div>
          )}
          {items.length == 4 && (
            <button className={styles["button"]} onClick={handleSubmit}>
              {" "}
              Play
            </button>
          )}
          {error && <p className={styles["error"]}>{error}</p>}
        </div>
        <div className={styles["dropdownContainer"]}>
          <label htmlFor="overs">Select Overs:</label>
          <select id="overs" value={selectedOver} onChange={handleChange} required>
            {[1, 2, 3, 4, 5].map((over) => (
              <option key={over} value={over}>
                {over} Overs
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Home;
