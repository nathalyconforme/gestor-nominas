<template>
  <div class="upload-payroll">
    <button
      class="ui button primary"
      @click="openCloseForm"
      :class="{ primary: !showForm, negative: showForm }"
    >
      {{ showForm ? "Cancelar subida" : "Nueva nómina" }}
    </button>
    <form
      class="ui form upload-payroll__form"
      :class="{ open: showForm }"
      @submit.prevent="handleSubmit"
    >
      <div class="field">
        <label for="file" class="ui icon button">
          <i class="file icon" />
          Seleccionar nómina
          <span v-if="file">({{ file.name }})</span>
        </label>
        <input
          type="file"
          id="file"
          style="display: none"
          @change="uploadFile"
        />
      </div>
      <div class="field">
        <div class="ui calendar">
          <div class="ui input left icon">
            <input
              type="date"
              name=""
              id=""
              @change="changeDate"
              :value="date"
            />
          </div>
        </div>
      </div>
      <button class="ui button positive" :class="{ loading }">
        Subir nómina
      </button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  auth,
  storage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  db,
  collection,
  addDoc,
} from "../../utils/firebase";

export default {
  name: "UploadPayroll",
  props:{
    getPayrolls: Function,
  },
  setup(props){
    let showForm = ref(false);
    let file = ref(null);
    let date = ref(null);
    let loading = ref(false);
    let error = ref(null);

    const openCloseForm = () => {
      showForm.value = !showForm.value;
    };

    const uploadFile = (e) => {
      const fileTemp = e.target.files[0];
      error.value = null;

      if (fileTemp.type === "application/pdf") {
        file.value = fileTemp;
      } else {
        error.value = "El fichero debe ser válido (PDF)";
      }
    };

    const changeDate = (e) => {
      date.value = e.target.value;
    };

    const handleSubmit = async () => {
      if (file.value && date.value) {
        loading.value = true;

        try {
          /**
           *
           * SUBIENDO EL FICHERO A FIREBASE STORAGE
           *
           */
          //Usamos uuid para generar un nombre único para el fichero
          const fileName = uuidv4();
          const userID = auth.currentUser.uid;

          //Creamos la ruta donde se guardará el fichero
          const path = `${userID}/${fileName}.pdf`;

          /**
           * Creamos una referencia al fichero usando el ref de firebase
           * al que se ha designado el nombre "storageRef"
           * */
          const storageReference = storageRef(storage, path);

          //Subimos el fichero a la ruta que hemos creado
          await uploadBytes(storageReference, file.value);
          /**
           *
           * SUBIENDO EL FICHERO A FIRESTORE
           *
           */
          //Obtenemos la URL del fichero que hemos subido
          const payrollUrl = await getDownloadURL(storageReference);
          // Guardamos la información en la base de datos
          await addDoc(collection(db, userID), {
            payrollUrl,
            date: new Date(date.value),
            dateCreated: date.value, /* Esto en String */
          });
          //Actualizamos la lista de nóminas usando la función que nos llega por props
          props.getPayrolls();
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
          file.value = null;
          date.value = null;
          showForm.value = false;
          error.value = null;
          document.getElementById("file").value = "";
        }
      }else{
        error.value = "Sube una nómina y selecciona la fecha";
      }
    };

    return {
      showForm,
      openCloseForm,
      file,
      date,
      loading,
      error,
      uploadFile,
      handleSubmit,
      changeDate,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-payroll {
  > button {
    margin-bottom: 20px;
  }
  &__form {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 0;
    overflow: hidden;
    transition: height 0.5s ease;

    &.open {
      height: 200px;
    }
  }
}
</style>