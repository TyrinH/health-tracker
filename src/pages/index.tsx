import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const createEntry = api.entries.createEntry.useMutation();
  const { data: sessionData } = useSession();
  console.log(sessionData);

  type Inputs = {
    mood: string;
    isSick: boolean;
    notes: string;
    author: string;
    authorId: string;
    exampleRequired: string;
  };

  const {
    register,
    handleSubmit,
    watch,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.author = sessionData?.user?.name || "Anonymous";
    data.authorId = sessionData?.user?.id || "Anonymous";
    await createEntry.mutateAsync(data).catch((err) => console.error(err));
  };

  console.log(watch("mood")); // watch input value by passing the name of it

  return (
    <>
      <Head>
        <title>Health tracker</title>
        <meta name="description" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Health Tracker
          </h1>
          <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
            <select
              className="select-bordered select w-full max-w-xs"
              {...register("mood")}
            >
              <option disabled selected>
                Mood
              </option>
              <option>Happy</option>
              <option>Sad</option>
            </select>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Were you sick today?</span>
                <input
                  placeholder="isSick"
                  className="toggle"
                  type="checkbox"
                  {...register("isSick")}
                />
              </label>
            </div>
            <textarea
              placeholder="Notes"
              className="textarea-bordered textarea textarea-lg w-full max-w-xs"
              {...register("notes")}
            />

            <button className="btn-success btn">Submit</button>
          </form>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
