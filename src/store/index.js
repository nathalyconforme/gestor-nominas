import { createStore } from 'vuex'

export default createStore({
  state: {
    //Generamos un usuario vacío
    user: undefined,
  },
  getters: {
  },
  mutations: {
    //Creamos una mutación para actualizar el usuario
    setUser(state, payload){
      state.user = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
