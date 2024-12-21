import LanguageSelector from '@/components/template/LanguageSelector'
import SignInForm from './SignInForm'
import Cover from '@/components/layouts/AuthLayout/Cover'
import { useTranslation } from 'react-i18next'

const SignIn = () => {
    const { t } = useTranslation()
    return (
        <>
            <div className="absolute top-10 end-10">
                <LanguageSelector />
            </div>
            <>
                <div className="mb-8">
                    <h3 className="mb-1">{t('auth.sign-in.welcome-back')}</h3>
                    <p>
                        {t(
                            'auth.sign-in.please-enter-your-credentials-to-sign-in'
                        )}
                    </p>
                </div>
                <SignInForm disableSubmit={false} />
            </>
        </>
    )
}

export default SignIn
