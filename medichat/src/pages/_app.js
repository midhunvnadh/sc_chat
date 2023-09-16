import "@/assets/App.css";

import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import Progress from "@/components/misc/Progress";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Progress />
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
