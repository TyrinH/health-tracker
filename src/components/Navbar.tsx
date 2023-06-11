/* eslint-disable @typescript-eslint/no-misused-promises */
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
} from "@fortawesome/free-regular-svg-icons";

export default function NavBar() {
  const { data: sessionData } = useSession();

  const createEntry = api.entries.createEntry.useMutation();

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
    document.getElementById("my_modal_6")?.click();
  };
  const mood = watch("mood");
  const isSick = watch("isSick");
  const EntryCreateForm = () => {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex">
            <h2 className="card-title inline-block">Add a new entry for  {dayjs().format("MMMM D, YYYY")}</h2>
            {/* <button htmlFor="my_modal_6" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
            <label htmlFor="my_modal_6" className="btn btn-sm btn-circle absolute right-2 top-2">x</label>
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
          <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
            <label className="label">
              <span className="label-text">What was your mood today?</span>
            </label>
            <select
              className="select-bordered select w-full max-w-xs"
              {...register("mood", { required: true })}
            >
              <option disabled selected>Choose one</option>
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
              <button className="btn-success btn mt-4" disabled={mood !== undefined ? false : true} >Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <button className="btn-ghost btn text-xl normal-case">
          <Link href="/">Home</Link>
        </button>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {sessionData && (
            <li>
              {/* The button to open modal */}
              <label htmlFor="my_modal_6" className="btn">Add entry</label>

              {/* Put this part before </body> tag */}
              <input type="checkbox" id="my_modal_6" className="modal-toggle" />
              <div className="modal">
                  <EntryCreateForm />
                  <div className="modal-action">
                </div>
              </div>
            </li>
          )}
          {sessionData && (
            <li>
             <button className="btn-ghost btn text-xl normal-case">
              <Link href="/stats">Stats</Link>
            </button>
            </li>
          )}
          <li>
            {!sessionData && (
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => void signIn()}
              >
                Sign In
              </button>
            )}
          </li>
          <li>{sessionData && <p>{sessionData?.user.name}</p>}</li>
          {sessionData && (
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                <div className="w-10 rounded-full">
                  {sessionData && (
                    <Image
                      src={sessionData?.user.image as string}
                      alt=""
                      width={56}
                      height={56}
                    />
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <button
                    onClick={
                      sessionData ? () => void signOut() : () => void signIn()
                    }
                  >
                    {sessionData ? "Sign out" : "Sign in"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
