import { getMatchScore } from "@/libs/actions/matchAction";
import Play from "@/components/Play/Play";

const Match = ({ data }) => {
  return (
    <>
      <Play data = {data} />
    </>
  );
};
export default Match;

export async function getServerSideProps(context) {
  const result = await getMatchScore(context.query.matchId);
  return {
    props: {
      data: result,
    },
  };
}
