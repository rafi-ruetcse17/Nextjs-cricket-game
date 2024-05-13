import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Homepage from "../components/Home/Home";
import tableData from "@/libs/data/player-list";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ tableDataProp }) {
  return (
    <>
      <Homepage tableData={tableDataProp}/>
    </>
  );
}

///SSG
export async function getStaticProps() {
  return {
    props: {
      tableDataProp: tableData,
    },
  };
}