import {
    faFaceFrown,
    faFaceMeh,
    faFaceSmile,
  } from "@fortawesome/free-regular-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useSession } from "next-auth/react";
  import Head from "next/head";
  import { LoadingPageSpinner } from "~/components/loading";
  import { type RouterOutputs, api } from "~/utils/api";

export default function EntriesFeed() {
    const { data: sessionData } = useSession();

  if (!sessionData) return null;
  const allEntries = api.entries.getAllEntries.useQuery();

  if (allEntries.isLoading) return <LoadingPageSpinner />;
  if (allEntries.isError) return <p>Error!</p>;

  type Entry = RouterOutputs["entries"]["getAllEntries"][number];

  const EntriesActionsDropdown = () => {

    return (
        <div className="dropdown">
            <label tabIndex={0} className="btn m-1">Click</label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Item 1</a></li>
                <li><a>Item 2</a></li>
            </ul>
        </div>

    )
  }

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
    const deleteEntry = api.entries.deleteEntry.useMutation();
    const deleteEntryAction = async () => {
      await deleteEntry.mutateAsync(entry);
      await allEntries.refetch();
    };
    console.log(entry.id)

    return (
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="flex">
          <p className="card-header inline-block px-4 py-4 text-2xl font-bold">
            {moodEmoji()}s
          </p>
          <p className="card-header inline-block px-4 py-4 text-2xl font-bold">
            {entry.date.toDateString()}
          </p>
            <EntriesActionsDropdown />
          {entry.isSick && (
            <p className="card-header inline-block px-4 py-4 text-5xl font-bold">
              {/* <FontAwesomeIcon icon={faHeadSideCough} size="2xl" style={{color: "#bababa",}} />
               */}
              😷
            </p>
          )}
        </div>
        <div className="card-body">
        <div className="card-actions justify-end">
            <button
              className="btn-outline btn-error btn-sm btn"
              // disabled={todo.completed}
              onClick={() => void deleteEntryAction()}
            >
                            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
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
} 