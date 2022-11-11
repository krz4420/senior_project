import axios from "axios";
import { BACKENDPOINT } from "../utils";

export type AuthData = {
  token: string;
  username: string;
  email: string;
  groups: Array<string>;
  userId: string;
};

const signIn = async (userInfo): Promise<AuthData> => {
  console.log("Sign in");
  const promise: AuthData = await new Promise((resolve, reject) => {
    axios
      .post(`${BACKENDPOINT}/LogIn`, userInfo)
      .then((res) => {
        console.log("RESULT", res.data.userID);
        const data: AuthData = {
          token: JWTTokenMock,
          username: res.data.username,
          email: res.data.email,
          groups: res.data.groups,
          userId: "Hello",
        };
        resolve(data);
      })
      .catch((error) => {
        console.log("Error in auth service sign in");
        reject(Error("Incorrect Credentials"));
      });
  });

  return promise;
};

export const authService = {
  signIn,
};

const JWTTokenMock =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikx1Y2FzIEdhcmNleiIsImlhdCI6MTUxNjIzOTAyMn0.oK5FZPULfF-nfZmiumDGiufxf10Fe2KiGe9G5Njoa64";
