import { useRef, useState } from "react";
import { UserInfo } from "./UserInfo";

function App() {
  const [username, setUsername] = useState<null | string>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  console.log();

  return (
    <div className="p-20 flex flex-col gap-14">
      <div className="flex items-center">
        <input
          ref={usernameInputRef}
          type="text"
          placeholder="Search by username"
          className="border py-2 px-4 rounded-lg outline-none"
        />
        <button
          className="px-4 py-2 ml-2 bg-indigo-500 text-white font-bold rounded-lg"
          onClick={() => {
            if (usernameInputRef.current?.value) {
              setUsername(usernameInputRef.current.value);
            }
          }}
        >
          Search
        </button>
      </div>
      <UserInfo username={username} />
    </div>
  );
}

export default App;
