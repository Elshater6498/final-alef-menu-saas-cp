import { cloneElement } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Logo from '@/components/template/Logo'
import type { ReactNode, ReactElement } from 'react'
import type { CommonProps } from '@/@types/common'
import { ActionLink } from '@/components/shared'
import appConfig from '@/configs/app.config'
import { APP_NAME } from '@/constants/app.constant'

interface SimpleProps extends CommonProps {
    content?: ReactNode
}

const Simple = ({ children, content, ...rest }: SimpleProps) => {
    return (
        <div className="h-full">
            <Container className="flex flex-col flex-auto items-center justify-center min-w-0 h-full">
                <Card
                    className="min-w-[320px] md:min-w-[600px]"
                    bodyClass="md:p-10"
                >
                    <div className="text-center">
                        <Logo type="full" imgClass="mx-auto w-40 mb-4" mode='light' />
                    </div>
                    <div className="text-center">
                        {content}
                        {children
                            ? cloneElement(children as ReactElement, {
                                  contentClassName: 'text-center',
                                  ...rest,
                              })
                            : null}
                    </div>
                    <div className="mt-4 flex items-center justify-center flex-auto w-full">
                    <span>
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
                </Card>
            </Container>
        </div>
    )
}

export default Simple
