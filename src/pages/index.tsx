/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import EntriesFeed from "./entriesFeed";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Health tracker</title>
        <meta name="description" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {sessionData ? <EntriesFeed /> : <p>Sign in to add an entry</p>}
          <div className="flex flex-col items-center gap-2"></div>
        </div>
      </main>
    </>
  );
};

export default Home;