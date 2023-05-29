/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";
import router from "next/router";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
} from "@fortawesome/free-regular-svg-icons";

const Home: NextPage = () => {
  const createEntry = api.entries.createEntry.useMutation();
  const { data: sessionData } = useSession();

  type Inputs = {
    mood: string;
    isSick: boolean;
    notes: string;
    author: string;
    authorId: string;
  };

  const { register, handleSubmit, watch } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.author = sessionData?.user?.name || "Anonymous";
    data.authorId = sessionData?.user?.id || "Anonymous";
    await createEntry.mutateAsync(data);
    await router.push("/entriesFeed");
  };
  const mood = watch("mood");
  const isSick = watch("isSick");
  const EntryCreateForm = () => {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        {/* <figure>
      <img
        src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
        alt="Shoes"
      />
    </figure> */}
        <div className="card-body">
          <div className="flex">
            <h2 className="card-title inline-block">Add a new entry</h2>
            <h2 className="card-title inline-block px-4">
              {dayjs().format("MMMM D, YYYY")}
            </h2>
          </div>
          <div className="flex">
            <p className="inline-block">
              {mood === "Happy" ? (
                <FontAwesomeIcon
                  icon={faFaceSmile}
                  size="4x"
                  style={{ color: "#1cf000" }}
                />
              ) : mood === "Meh" ? (
                <FontAwesomeIcon
                  icon={faFaceMeh}
                  size="4x"
                  style={{ color: "#ffe438" }}
                />
              ) : mood === "Sad" ? (
                <FontAwesomeIcon
                  icon={faFaceFrown}
                  size="4x"
                  style={{ color: "#ff0000" }}
                />
              ) : (
                ""
              )}
            </p>
            {isSick && <p className="inline-block text-6xl font-bold">😷</p>}
          </div>
          {/* <p>If a dog chews shoes whose shoes does he choose?</p> */}
          <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
            <label className="label">
              <span className="label-text">What was your mood today?</span>
            </label>
            <select
              className="select-bordered select w-full max-w-xs"
              {...register("mood", { required: true })}
            >
              <option>Happy</option>
              <option>Meh</option>
              <option>Sad</option>
            </select>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Were you sick today?</span>
                <input
                  placeholder="isSick"
                  className="checkbox"
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

            <div className="card-actions justify-end">
              <button className="btn-success btn mt-4">Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
          {sessionData ? <EntryCreateForm /> : <p>Sign in to add an entry</p>}
          <div className="flex flex-col items-center gap-2"></div>
        </div>
      </main>
    </>
  );
};

export default Home;
