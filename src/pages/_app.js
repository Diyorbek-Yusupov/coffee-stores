import "@/styles/globals.scss";
import { IBM_Plex_Sans } from "@next/font/google";

const iBM_Plex_Sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={iBM_Plex_Sans.className}>
      <Component {...pageProps} />
    </main>
  );
}
