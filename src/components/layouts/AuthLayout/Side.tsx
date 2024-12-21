import { cloneElement } from 'react'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { useTranslation } from 'react-i18next'
import { ActionLink } from '@/components/shared'
import appConfig from '@/configs/app.config'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    const { t } = useTranslation()
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover   hidden lg:block"
                style={{
                    backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                }}
            >
                <div className="w-full h-full py-6 px-16 flex flex-col justify-between bg-black/60">
                    <div className="w-28">
                        <Logo mode="dark" />
                    </div>
                    <div>
                        <p className="text-white text-2xl font-semibold">
                            {t('general.side-title')}
                        </p>
                    </div>
                    <span className="text-white">
                        Powered by{' '}
                        <ActionLink
                            to={`${appConfig.mainurl}`}
                            target="_blank"
                            themeColor={false}
                        >
                            <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                        </ActionLink>
                    </span>
                </div>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
