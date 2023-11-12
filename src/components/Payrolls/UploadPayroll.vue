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
          <span v-if="file">({{file.name}})</span>
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
            <input type="date" name="" id="" @change="changeDate"
            :value="date" />
          </div>
        </div>
      </div>
      <button class="ui button positive">Subir nómina</button>
      <p v-if="error">{{error}}</p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "UploadPayroll",
  setup() {
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
      }else{
        error.value = "El fichero debe ser válido (PDF)";
      }
    };

    const changeDate = (e) => {
      date.value = e.target.value;
    };

    const handleSubmit = () => {
      // console.log("Subiendo nómina...");
      // console.log("FILE --> ", file.value);
      // console.log("DATE --> ", date.value);


      if (file.value && date.value){
        console.log("Subiendo nómina...");
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
