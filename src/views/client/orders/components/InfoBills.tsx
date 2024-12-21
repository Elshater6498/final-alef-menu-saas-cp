import { Button, Dialog } from '@/components/ui'
import { useRef } from 'react'
import Invoice from './Invoice'
import { order } from '@/@types/order'
import { useReactToPrint } from 'react-to-print'
import { useTranslation } from 'react-i18next'

const InfoBills = ({
    isOpen,
    closeDialoge,
    selectedBills,
    setSelecte,
}: {
    isOpen: boolean
    closeDialoge: () => void
    setSelecte: () => void
    selectedBills: order
}) => {
    const { t, i18n } = useTranslation()
    const contentRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({ contentRef })
    return (
        <Dialog
            isOpen={isOpen}
            onClose={closeDialoge}
            onAfterClose={() => {
                setSelecte()
            }}
        >
            <div className="h-[500px] overflow-y-auto flex justify-center">
                <Invoice ref={contentRef} item={selectedBills} />
            </div>
            <div className="flex gap-2 justify-end items-center">
                <Button variant="solid" onClick={() => handlePrint()}>
                    {t('orders.print')}
                </Button>
            </div>
        </Dialog>
    )
}

export default InfoBills
