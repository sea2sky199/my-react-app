import { observable, decorate, action } from "mobx";

class UserInfoStore {
  //@observable
  userInfo = {};

  //@action
  setUserInfo(info) {
    this.userInfo = info || {};
  }
}

decorate(UserInfoStore, {
  userInfo: observable,
  setUserInfo: action
});

const userInfoStore = new UserInfoStore();

export default userInfoStore;
