import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { LoadingPageSpinner } from "~/components/loading";
import { type RouterOutputs, api } from "~/utils/api";



const EntriesFeed: NextPage = () => {
  const { data: sessionData } = useSession();


if (!sessionData) return null;
const allEntries = api.entries.getAllEntries.useQuery();

if (allEntries.isLoading) return <LoadingPageSpinner />;
if (allEntries.isError) return <p>Error!</p>;

    type Entry = RouterOutputs["entries"]["getAllEntries"][number]

  const Card = (entry: Entry) => {

    const moodColor = () => {
        if (entry.mood === "Happy") {
            return "text-green-500";
        } else if (entry.mood === "Meh") {
            return "text-yellow-500";
        } else if (entry.mood === "Sad") {
            return "text-red-500";
        } else {
            return "text-gray-500";
        }
    }

    const sickEmoji = () => {
        if (entry.isSick === true) {
            return "😷";
        } else {
            return "😊";
        }
    }

    return (
      <div className="card-compact card w-96 bg-base-100 shadow-xl">
        <div className="flex">
          <p className="card-header inline-block px-4 py-4 text-2xl font-bold">
            {entry.date.toDateString()}
          </p>
          <p className="card-header inline-block px-4 py-4 text-2xl font-bold">
            {sickEmoji()}
          </p>
        </div>
        <div className="card-body">
          <h2 className="card-title">
            Your mood today was:{" "}
            <span className={moodColor()}>{entry.mood}</span>
          </h2>
          <p>{entry.notes}</p>
          <div className="card-actions justify-end">
            {/* <button className="btn-primary btn">Buy Now</button> */}
          </div>
        </div>
      </div>
    );

  }


    return (
      <>
        <Head>
          <title>Entries Feed</title>
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">Entries Feed</h1>
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
              {allEntries.data?.map((entry) => (
                <Card {...entry} key={entry.id} />
                ))}
          </div>
        </main>
      </>
    );
}

export default EntriesFeed