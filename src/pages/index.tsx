/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";

const Home: NextPage = () => {
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
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    data.author = sessionData?.user?.name || "Anonymous";
    data.authorId = sessionData?.user?.id || "Anonymous";
    createEntry.mutate(data);
    return
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
                How are you feeling today?
              </option>
              <option>Happy</option>
              <option>Meh</option>
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

            <button className="btn-success btn mt-4">Submit</button>
          </form>
          <div className="flex flex-col items-center gap-2">
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

