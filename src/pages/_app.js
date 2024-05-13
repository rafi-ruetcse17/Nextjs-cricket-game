import "@/styles/globals.css";
import Home from "../components/Home/Home";

export default function App({ Component, pageProps }) {
  return (
    <>
        <Component {...pageProps} />
    </>
  );
}
