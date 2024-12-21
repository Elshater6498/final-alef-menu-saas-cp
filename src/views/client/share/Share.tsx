import Title from '@/components/shared/Title'
import { Button } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { MdOutlineShare } from 'react-icons/md'
import { QRCodeCanvas } from 'qrcode.react'
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from 'react-share'
import { useAppSelector } from '@/store'
import appConfig from '@/configs/app.config'

const Share = () => {
    const { t } = useTranslation()
    const RestaurantInfo = useAppSelector(
        (state) => state.restaurant.restaurant
    )
    const downloadQRCode = () => {
        const qrCodeURL = (
            document.getElementById('qrCodeEl') as HTMLCanvasElement
        )
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream')
        let aEl = document.createElement('a')
        aEl.href = qrCodeURL
        aEl.download = 'QR_Code.png'
        document.body.appendChild(aEl)
        aEl.click()
        document.body.removeChild(aEl)
    }

    return (
        <>
            <Title Icon={MdOutlineShare} title={`${t('nav.share')}`} />
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-4 lg:flex-row ltr:flex-row-reverse md:justify-between items-center md:my-10">
                <div className="w-full lg:w-auto flex flex-col items-center gap-6">
                    <div className="w-full md:w-auto flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-xl">{t('share.Menu link')} :</p>{' '}
                            <a
                                dir="ltr"
                                href={`${appConfig.mainurl}${RestaurantInfo?.url}`}
                                target={'_blank'}
                                rel="noreferrer"
                                className="bg-slate-400 py-1 px-4 rounded-md text-white"
                            >
                                {appConfig.mainurl}{RestaurantInfo?.url!}
                            </a>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
                        <p className="text-xl">
                            {t('share.Share the menu link on')} :
                        </p>
                        <div className="flex gap-5 items-center justify-center">
                            <FacebookShareButton url={RestaurantInfo?.url!}>
                                <FacebookIcon size={30} round />
                            </FacebookShareButton>
                            <WhatsappShareButton url={RestaurantInfo?.url!}>
                                <WhatsappIcon size={30} round />
                            </WhatsappShareButton>
                            <TelegramShareButton url={RestaurantInfo?.url!}>
                                <TelegramIcon size={30} round />
                            </TelegramShareButton>
                            <TwitterShareButton url={RestaurantInfo?.url!}>
                                <XIcon size={30} round />
                            </TwitterShareButton>
                        </div>
                    </div>
                    <Button
                        className="w-full mt-2"
                        variant="solid"
                        onClick={downloadQRCode}
                    >
                        {t('share.Download Qr Code')}
                    </Button>
                </div>
                <div className={`p-4 rounded-md border`}>
                    <QRCodeCanvas
                        id="qrCodeEl"
                        value={appConfig.mainurl+RestaurantInfo?.url!}
                        level={'Q'}
                        size={200}
                        bgColor={'#FFFFFF00'}
                    />
                </div>
            </div>
        </>
    )
}

export default Share
