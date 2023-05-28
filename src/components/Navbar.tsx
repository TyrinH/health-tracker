import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const { data: sessionData } = useSession();

  // if(!sessionData) {
  //   return null
  // }

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <button className="btn-ghost btn text-xl normal-case">
          <Link href="/">Home</Link>
        </button>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            {/* {sessionData && <button >
              <Link href="/createTodo">Create Todo</Link>
            </button>} */}
          </li>
          <li>
            <Link href="/entriesFeed">Entries Feed</Link>
          </li>
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