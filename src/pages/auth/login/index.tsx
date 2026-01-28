import { LoginForm } from '../../../features/auth'
import { AuthLayout } from '../../../widgets/auth-layout'

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage