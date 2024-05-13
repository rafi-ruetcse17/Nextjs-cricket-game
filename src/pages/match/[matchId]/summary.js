import Summary from "@/components/Summary/Summary";
import { getMatchScore } from "@/libs/actions/matchAction";

const MatchSummary = ({ data }) => {
  return (
    <>
      <Summary data={data} />
    </>
  );
};

export default MatchSummary;

export async function getServerSideProps(context) {
  const result = await getMatchScore(context.query.matchId);
  return {
    props: {
      data: result,
    },
  };
}
