import { useCallback, useEffect, useReducer, useState } from "react";
import { fetchGithubUser } from "./userService";

type UserInfoProps = {
  username: string | null;
};

enum REQUEST_STATUS {
  IDLE = "idle",
  PENDING = "pending",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

const asyncReducer = (state: any, action: any) => {
  switch (action.type) {
    case REQUEST_STATUS.PENDING:
      return {
        status: REQUEST_STATUS.PENDING,
        data: null,
        error: null,
      };

    case REQUEST_STATUS.RESOLVED: {
      return {
        status: REQUEST_STATUS.RESOLVED,
        data: action.data,
        error: null,
      };
    }

    case REQUEST_STATUS.REJECTED: {
      return {
        status: REQUEST_STATUS.REJECTED,
        data: null,
        error: action.error,
      };
    }

    default:
      throw Error(`Unhandled action ${action.type}`);
  }
};

const useAsync = (initialState: any) => {
  const [state, dispatch] = useReducer<(state: any, actions: any) => any>(
    asyncReducer,
    initialState
  );

  const run = useCallback((promise: any) => {
    dispatch({ type: REQUEST_STATUS.PENDING });

    promise.then(
      (data: any) => {
        dispatch({ type: REQUEST_STATUS.RESOLVED, data });
      },
      (error: any) => {
        dispatch({ type: REQUEST_STATUS.REJECTED, error });
      }
    );
  }, []);

  return { ...state, run };
};

export function UserInfo({ username }: UserInfoProps) {
  const initialRequestStatus = username
    ? REQUEST_STATUS.PENDING
    : REQUEST_STATUS.IDLE;

  const {
    status,
    error,
    data: user,
    run,
  } = useAsync({
    user: null,
    error: null,
    status: initialRequestStatus,
  });

  useEffect(() => {
    if (!username) return;

    run(fetchGithubUser(username));
  }, [username, run]);

  switch (status) {
    case REQUEST_STATUS.IDLE:
      return <span>Submit user</span>;

    case REQUEST_STATUS.PENDING:
      return <h1 className="text-red-400">User fallback</h1>;

    case REQUEST_STATUS.RESOLVED:
      return (
        <div className="flex flex-col gap-4 items-center">
          <img
            src={user?.avatar_url}
            alt=""
            className="rounded-full w-28 h-28"
          />
          <span className="text-xl font-medium">{user?.name}</span>
          <p>{user?.bio}</p>
        </div>
      );

    case REQUEST_STATUS.REJECTED:
      return (
        <div>
          There was an error
          <pre className="whitespace-normal">{error}</pre>
        </div>
      );

    default:
      return <div>Non states handled</div>;
  }
}
