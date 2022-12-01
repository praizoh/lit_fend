import { BehaviorSubject } from "rxjs";
const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user"))
);

const profileSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("profile"))
);


export const userService = {
    user: userSubject.asObservable(),
    get userValue() {
      return userSubject.value;
    },
};

export const profileService = {
  profile: profileSubject.asObservable(),
  get profileValue() {
    return profileSubject.value;
  },
};