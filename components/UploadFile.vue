<template>
  <div
    class="
      relative
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      py-12
      px-4
      sm:px-6
      lg:px-8
      bg-gray-500 bg-no-repeat bg-cover
      relative
      items-center
    "
  >
    <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
    <div class="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
      <div class="text-center">
        <h2 class="mt-5 text-3xl font-bold text-gray-900">File Upload!</h2>
        <p class="mt-2 text-sm text-gray-400">
          It's time to judge the true kindness.
        </p>
      </div>
      <div class="mt-8 space-y-3">
        <div class="grid grid-cols-1 space-y-2">
          <label class="text-sm font-bold text-gray-500 tracking-wide"
            >Title</label
          >
          <input
            class="
              text-base
              p-2
              border border-gray-300
              rounded-lg
              focus:outline-none focus:border-indigo-500
            "
            type=""
            placeholder="mail@gmail.com"
          />
        </div>
        <div class="grid grid-cols-1 space-y-2">
          <label class="text-sm font-bold text-gray-500 tracking-wide"
            >Attach Document</label
          >
          <div class="flex items-center justify-center w-full">
            <label
              class="
                flex flex-col
                rounded-lg
                border-4 border-dashed
                w-full
                h-80
                group
                text-center
              "
            >
              <div
                class="
                  h-full
                  w-full
                  text-center
                  flex flex-col
                  items-center
                  justify-center
                "
                v-if="!value && !isCameraMode"
              >
                <div class="flex flex-auto max-h-60 mx-auto -mt-10">
                  <img
                    class="has-mask h-60 object-center"
                    src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                    alt="freepik image"
                  />
                </div>
                <p class="pointer-none text-gray-500">
                  <span class="text-sm">Drag and drop</span> files here <br />
                  or
                  <label class="text-blue-600 hover:underline">
                    <input
                      ref="file"
                      class="hidden"
                      type="file"
                      @change="upload"
                    />
                    select a file
                  </label>
                  from your computer
                </p>
              </div>
              <div v-else-if="value && !isCameraMode" class="uploaded">
                <img class="max-h-70 mx-auto" :src="value" />
              </div>
              <div class="rounded-md" v-else-if="isCameraMode">
                <video
                  v-show="!imageCaptured && isCameraMode"
                  ref="video"
                  class="full-width"
                  autoplay
                />
                <canvas
                  v-show="imageCaptured"
                  ref="canvas"
                  class="full-width border-solid h-80"
                />
              </div>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-center w-full h-full">
          <div
            class="
              flex
              justify-center
              items-center
              space-x-1
              text-sm text-gray-700
            "
            v-if="loading"
          >
            <svg
              fill="none"
              class="w-6 h-6 animate-spin"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
            <div>Loading ...</div>
          </div>
        </div>
        <div class="row">
          <span class="text-sm text-gray-300">File type: jpeg, png</span>
          <button
            class="text-red-400 rounded-full ml-2"
            @click="deleteImage"
            v-if="value && !isCameraMode"
          >
            Delete Image ×
          </button>
          <button
            class="rounded-full border w-20"
            v-if="hasCameraSupport && isCameraMode"
            @click="captureImage"
          >
            Capture
          </button>
        </div>
        <div class="grid grid-cols-8 gap-4">
          <button class="col-span-1 w-12 h-12 rounded-full bg-gray-300">
            <fa
              icon="camera"
              aria-hidden="true"
              v-if="hasCameraSupport"
              class="size"
              @click="initCamera"
            />
          </button>
          <button
            class="
              col-span-1
              text-green-600
              hover:underline
              w-12
              h-12
              rounded-full
              bg-gray-300
            "
          >
            <input ref="file" class="hidden" type="file" @change="upload" />
            <fa icon="upload" aria-hidden="true" class="size" />
          </button>
          <button
            type="submit"
            class="
              col-span-6
              flex
              justify-center
              bg-blue-500
              text-gray-100
              w-full
              p-4
              rounded-full
              tracking-wide
              font-semibold
              focus:outline-none focus:shadow-outline
              hover:bg-blue-600
              shadow-lg
              cursor-pointer
              transition
              ease-in
              duration-300
            "
            @click="postFile"
            :disabled="!value"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'UploadFile',

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      file: null,
      loading: false,
      imageCaptured: false,
      hasCameraSupport: true,
      isCameraMode: false,
    }
  },
  mounted() {
    // this.initCamera()
  },
  methods: {
    async upload(event: any) {
      const files = event.target.files || event.dataTransfer.files
      const file = files[0]
      this.file = file

      if (this.checkFile(file)) {
        const picture = await this.getBase64(file)
        this.$emit('input', picture)
      }
    },
    getBase64(file: Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },
    checkFile(file: Blob) {
      let result = true
      const SIZE_LIMIT = 5000000 // 5MB
      // キャンセルしたら処理中断
      if (!file) {
        result = false
      }
      // jpeg か png 関連ファイル以外は受付けない
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        result = false
      }
      // 上限サイズより大きければ受付けない
      if (file.size > SIZE_LIMIT) {
        result = false
      }
      return result
    },
    // mounted() {
    //   this.initCamera()
    // },
    beforeDestroy() {
      if (this.hasCameraSupport) {
        this.disableCamera()
      }
    },
    initCamera() {
      this.isCameraMode = true
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          ;(this.$refs.video as any).srcObject = stream
        })
        .catch((error) => {
          this.hasCameraSupport = false
        })
    },
    async captureImage() {
      let video = this.$refs.video as any
      let canvas = this.$refs.canvas as any
      canvas.width = video.getBoundingClientRect().width
      canvas.height = video.getBoundingClientRect().height
      let context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      this.imageCaptured = true
      this.file = this.dataURItoBlob(canvas.toDataURL()) as any
      const picture = await this.getBase64(this.file as any)
      this.$emit('input', picture)
      this.disableCamera()
    },
    disableCamera() {
      this.isCameraMode = false
      let video = this.$refs.video as any
      video.srcObject.getVideoTracks().forEach((track: any) => {
        track.stop()
      })
    },
    dataURItoBlob(dataURI: any) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1])

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length)

      // create a view into the buffer
      var ia = new Uint8Array(ab)

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString })
      return blob
    },
    deleteImage() {
      this.$emit('input', null)
      this.file = null
      this.imageCaptured = false
    },
    postFile() {
      this.loading = true
      let formData = new FormData()
      formData.append('file', this.file as any)
      let config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
      this.$axios
        .post(`http://localhost:8000/files/analyze`, formData, config)
        .then((response) => {
          console.log('response: ', response)
          this.loading = false
        })
        .catch((err) => {
          console.log('err: ', err)
          this.loading = false
        })
    },
  },
})
</script>

<style>
.has-mask {
  position: relative;
  width: 100%;
  /* rect(<top>, <right>, <bottom>, <left>) */
  clip: rect(50px, 300px, 200px, 10px);
}

.size {
  font-size: 1.5em; /*1.5倍にする*/
}
</style>