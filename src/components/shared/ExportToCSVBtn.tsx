import { useTranslation } from 'react-i18next'
import { Button } from '../ui'
import { BsFiletypeCsv } from 'react-icons/bs'
import { exportToExcel } from 'react-json-to-excel'
type Props = {
    data: any
    filename: string
}

const ExportToCSVBtn = ({
    data,
    filename = 'data',
}: Props) => {
    const { t } = useTranslation()
    return (
        <Button
            variant="solid"
            size="sm"
            color="green"
            icon={<BsFiletypeCsv />}
            onClick={() => {
                exportToExcel(data, filename)
            }}
        >
            {t('general.export')}
        </Button>
    )
}

export default ExportToCSVBtn
