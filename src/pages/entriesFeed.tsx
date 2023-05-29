import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  type Entry = RouterOutputs["entries"]["getAllEntries"][number];

  const Card = (entry: Entry) => {
    const moodEmoji = () => {
      if (entry.mood === "Happy") {
        return (
          <FontAwesomeIcon
            icon={faFaceSmile}
            size="2xl"
            style={{ color: "#1cf000" }}
          />
        );
      } else if (entry.mood === "Meh") {
        return (
          <FontAwesomeIcon
            icon={faFaceMeh}
            size="2xl"
            style={{ color: "#ffe438" }}
          />
        );
      } else if (entry.mood === "Sad") {
        return (
          <FontAwesomeIcon
            icon={faFaceFrown}
            size="2xl"
            style={{ color: "#ff0000" }}
          />
        );
      } else {
        return "text-gray-500";
      }
    };

    const moodStyleColor = () => {
      if (entry.mood === "Happy") {
        return "text-green-500";
      } else if (entry.mood === "Meh") {
        return "text-yellow-300";
      } else if (entry.mood === "Sad") {
        return "text-red-600";
      }
    };

    return (
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="flex">
          <p className="card-header inline-block px-4 py-4 text-2xl font-bold">
            {entry.date.toDateString()}
          </p>
          <p className="card-header inline-block px-4 py-4 text-2xl font-bold">
            {moodEmoji()}
          </p>
          {entry.isSick && (
            <p className="card-header inline-block px-4 py-4 text-5xl font-bold">
              {/* <FontAwesomeIcon icon={faHeadSideCough} size="2xl" style={{color: "#bababa",}} />
               */}
              😷
            </p>
          )}
        </div>
        <div className="card-body">
          <h2 className="card-title text-3xl">
            <span className={moodStyleColor()}>{entry.mood}</span>
          </h2>
          <p>{entry.notes}</p>
          <div className="card-actions justify-end">
            {/* <button className="btn-error btn">Buy Now</button> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Entries Feed</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Entries Feed
        </h1>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {allEntries.data?.map((entry) => (
            <Card {...entry} key={entry.id} />
          ))}
        </div>
      </main>
    </>
  );
};

export default EntriesFeed;
