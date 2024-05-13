import { useEffect, useState } from "react";
import styles from "./TossComponent.module.css"
import { useRouter } from "next/router";

const TossComponent = () => {
  const router = useRouter()
  const matchId = router.query.matchId
  const [teams, setTeams] = useState([]);
  const [tossResult, setTossResult] = useState(null);


  useEffect(()=>{
    const storedTeams = JSON.parse(localStorage.getItem("items"));
    if(storedTeams) setTeams(storedTeams)
  }, [])

  const handleToss = () => {
    const result = Math.random() < 0.5 ? [teams[0], 0] : [teams[2], 2];
    setTossResult(result);
  };
  const handlePlay = () => {
    localStorage.setItem("tossResult", JSON.stringify(tossResult))
    router.replace(`/match/${matchId}`)
  };

  return (
    <div>
        <div className={styles["container"]}>
          <div className={styles["center-elements"]}>
            <h2>
              {teams[0]} vs {teams[2]}
            </h2>
            {!tossResult && (
              <button onClick={handleToss} className={styles["toss"]}>
                Toss!
              </button>
            )}

            {tossResult && (
              <div>
                <button onClick={handlePlay} className={styles["toss"]}>
                  Play!
                </button>
                <h3>{tossResult?.at(0)} will bat first...</h3>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default TossComponent;
