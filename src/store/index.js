import { createStore } from 'vuex'
import { auth } from "../utils/firebase"

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
    /**Hacer petición a firebase, recoger los nuevos datos
     * y llamar a la mutación para actualizar el usuario
     */
    reloadUser({commit}){
      auth.onAuthStateChanged((user) => {
        //Con el commit se ejecuta la mutación setUser
        //Obtenemos los datos del usuario y los guardamos como objeto
        commit("setUser", {...user});
      })
    }
    
  },
  modules: {
  }
})
