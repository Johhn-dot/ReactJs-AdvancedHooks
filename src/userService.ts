const BASEURL = "https://api.github.com/users";

export function fetchGithubUser(username: string) {
  return fetch(`${BASEURL}/${username}`).then((response) => {
    if (!response.ok) {
      return Promise.reject("User not found");
    }

    return response.json();
  });
}
