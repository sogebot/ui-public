export const state = () => ({
  loggedUser:    null,
  configuration: null,
  currentGame:   '',
  currentTitle:  '',
  currentTags:   [],
  loadingMsg:    '',
  isUILoaded:    false,
  isMobile:      false,
})

export const mutations = {
  setLoggedUser (state: { loggedUser: any; }, user: any) {
    state.loggedUser = user;
  },
  setConfiguration (state: { configuration: any; }, configuration: any) {
    state.configuration = configuration;
  },
  setCurrentGame (state: { currentGame: any; }, currentGame: any) {
    state.currentGame = currentGame;
  },
  setCurrentTitle (state: { currentTitle: any; }, currentTitle: any) {
    state.currentTitle = currentTitle;
  },
  setCurrentTags (state: { currentTags: any; }, currentTags: any) {
    state.currentTags = currentTags;
  },
  setLoadingMsg (state: { loadingMsg: any; }, loadingMsg: any) {
    state.loadingMsg = loadingMsg;
  },
  setUILoaded (state: { isUILoaded: boolean; }) {
    state.isUILoaded = true;
  },
  setMobile (state: { isMobile: any; }, value: any) {
    state.isMobile = value;
  },
};