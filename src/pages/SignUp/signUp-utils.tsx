type InputField = {
  content: string,
  error: boolean
}

type InitStateType = {
  name: InputField,
  email: InputField,
  id: InputField,
  password: InputField,
  confirmPassword: InputField,

}

export const initState: InitStateType = {
  name: {
    content: '',
    error: false
  },
  email: {
    content: '',
    error: false
  },
  id: {
    content: '',
    error: false
  },
  password: {
    content: '',
    error: false
  },
  confirmPassword: {
    content: '',
    error: false
  }
}