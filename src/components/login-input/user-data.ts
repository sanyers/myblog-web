export const loginText = {
  title: import.meta.env.VITE_MANAGE,
  user: '账号登录',
  button: '登录',
  reButton: '注册并登录',
}

export const userLoginData = () => ({
  userName: {
    bindKey: 'userName',
    path: 'userName.value',
    label: '账号',
    value: '',
    type: 'text',
    placeholder: '请输入账号',
    rule: [
      {
        required: true,
        message: '请输入账号',
        trigger: ['input', 'blur'],
      },
    ],
  },
  userPwd: {
    bindKey: 'userPwd',
    path: 'userPwd.value',
    label: '密码',
    value: '',
    type: 'password',
    placeholder: '请输入密码',
    rule: [
      {
        required: true,
        message: '请输入密码',
        trigger: ['input', 'blur'],
      },
    ],
  },
})

export default {
  loginText,
  userLoginData,
}
