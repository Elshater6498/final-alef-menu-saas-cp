import classNames from 'classnames'
import Container from '@/components/shared/Container'
import { PAGE_CONTAINER_GUTTER_X } from '@/constants/theme.constant'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '@/constants/app.constant'
import { ActionLink } from '../shared'
import appConfig from '@/configs/app.config'

export type FooterPageContainerType = 'gutterless' | 'contained'

type FooterProps = {
    pageContainerType: FooterPageContainerType
}

const FooterContent = () => {
    return (
        <div className="flex items-center justify-center flex-auto w-full">
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
    )
}

export default function Footer({
    pageContainerType = 'contained',
}: FooterProps) {
    return (
        <footer
            className={classNames(
                `footer flex flex-auto items-center h-16 ${PAGE_CONTAINER_GUTTER_X}`
            )}
        >
            {pageContainerType === 'contained' ? (
                <Container>
                    <FooterContent />
                </Container>
            ) : (
                <FooterContent />
            )}
        </footer>
    )
}
