import LanguageSelector from '@/components/template/LanguageSelector'
import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPassword = () => {
    return (
        <div className="">
            <div className="absolute top-10 end-10">
                <LanguageSelector />
            </div>
            <ForgotPasswordForm disableSubmit={false} />
        </div>
    )
}

export default ForgotPassword
