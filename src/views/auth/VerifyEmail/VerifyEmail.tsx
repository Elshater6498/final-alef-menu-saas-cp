
import { ActionLink, DoubleSidedImage } from '@/components/shared';
import { Spinner } from '@/components/ui';
import BaseService from '@/services/BaseService';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ImSpinner9 } from 'react-icons/im'
import { useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const { t } = useTranslation()
    const { token } = useParams();
    const [isLoading , setisLoadingl] = useState(true);
    const [isverifyEmail , setIsverifyEmail] = useState(false);
    
    const verifyEmail = async () => {
      setisLoadingl(true)
        try {
            const resp = await BaseService.get(`/auth/users/${token}/verify`)
            if(resp.status === 200){
                setIsverifyEmail(true)
            }else{
              setIsverifyEmail(false)
            }
        } catch (error) {
            console.error(error)
            setIsverifyEmail(false)
        }finally{
          setisLoadingl(false)
        }
    }

    useEffect(() => {
        if (token) {
            verifyEmail()
        }
    },[token])

    return (
      isLoading ? <div className='w-full flex justify-center items-center h-96'>
    <Spinner size={40} indicator={ImSpinner9} />
    </div> :  isverifyEmail ?  <div className="text-center mt-10">
            <DoubleSidedImage
                className="mx-auto mb-8"
                src="/img/others/welcome.png"
                darkModeSrc="/img/others/welcome-dark.png"
                alt="Welcome"
            />
            <h3 className="mb-2">{t('general.Email verified')}</h3>
            <p className="text-base">{t('general.You can now log in')}</p>
            <div className="mt-8 max-w-[350px] mx-auto">
                <ActionLink
                    to="/sign-in"
                    className="mb-2"
                >
                    {t('auth.sign-in.sign-in')}
                </ActionLink>
            </div>
        </div> : <div className="text-center mt-10">
            <DoubleSidedImage
                className="mx-auto mb-8"
                src="/img/others/img-2.png"
                darkModeSrc="/img/others/img-2-dark.png"
                alt="Welcome"
            />
            <h3 className="mb-2">{t('general.Email not verified')}</h3>
            <p className="text-base">{t('general.An error occurred while verifying your email. Please try again')}</p>
        </div>
    )
}

export default VerifyEmail
