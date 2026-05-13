class UserInfoStore {
  userInfo = {};

  setUserInfo(info) {
    this.userInfo = info || {};
  }
}

const userInfoStore = new UserInfoStore();

export default userInfoStore;
