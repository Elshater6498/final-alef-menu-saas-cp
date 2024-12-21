import { PlanType } from "@/@types/plan"
import { ColumnDef, ConfirmDialog, DataTable } from "@/components/shared"
import Title from "@/components/shared/Title"
import { Button, Notification, Switcher, toast, Tooltip } from "@/components/ui"
import { apiDeletePlan, apiGetPlans, apiUpdatePlan } from "@/services/PlanService"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { GoPackage } from "react-icons/go"
import { HiPlusCircle } from "react-icons/hi"
import { MdDelete, MdEdit } from "react-icons/md"
import PackagesDialog from "./components/PackagesDialog"

const Packages = () => {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<PlanType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState<PlanType>({})
  const [dialogIsOpen, setdialogIsOpen] = useState(false)
  const [confirmdialogIsOpen, setConfirmdialogIsOpen] = useState(false)
  const [confirmdialogIsOpenisActive, setConfirmdialogIsOpenisActive] =
    useState(false)

  //Add and edit
  const openDialog = () => {
    setdialogIsOpen(true)
  }
  const onDialogClose = () => {
    setdialogIsOpen(false)
  }
  const setSelecte = () => {
    setSelectedRow({})
  }
  //Add and edit

  // Activate | Deactivate
  const openConfirmDialogActivate = () => {
    setConfirmdialogIsOpenisActive(true)
  }
  const handleCloseActivate = () => {
    setConfirmdialogIsOpenisActive(false)
  }
  const handleConfirmActivate = async () => {
    const formdata = new FormData()
    formdata.append('active', `${!selectedRow.active}`)
    formdata.append(
      'name', selectedRow.name!
    )
    formdata.append('price', selectedRow.price!.toString())
    formdata.append('duration', selectedRow.duration!.toString())
    formdata.append(
      'details',
      selectedRow.details!
    )
    try {
      const response = await apiUpdatePlan(formdata, selectedRow.id!)
      if (response.status === 200) {
        handleCloseActivate()
        await fetchPlans()
        toast.push(
          <Notification title={`${t('general.ok')}`} type="success">
            {selectedRow.active
              ? t('general.deactivate-success')
              : t('general.activate-success')}
          </Notification>
        )
        setSelectedRow({})
      }
    } catch (error) {
      console.error(error)
      toast.push(
        <Notification title={`${t('general.error')}`} type="danger">
          {t('general.error-message')}.
        </Notification>
      )
    }
  }
  // Activate | Deactivate


  // delete
  const openConfirmDialog = () => {
    setConfirmdialogIsOpen(true)
  }
  const handleClose = () => {
    setConfirmdialogIsOpen(false)
  }
  const handleConfirm = async () => {
    try {
      const res = await apiDeletePlan(selectedRow)
      if (res.status === 204) {
        await fetchPlans()
        handleClose()
        setSelectedRow({})
        toast.push(
          <Notification title={`${t('general.ok')}`} type="success">
            {t('general.delete-success')}.
          </Notification>
        )
      }
    } catch (error) {
      toast.push(
        <Notification title={`${t('general.error')}`} type="danger">
          {t('general.error-message')}.
        </Notification>
      )
    }
  }
  // delete

  // handel Table
  const columns = useMemo<ColumnDef<PlanType>[]>(
    () => [
      {
        header: `${t('package-management.package-name')}`,
        accessorKey: 'name',
        enableSorting: false,
        cell: ({ row }) => <p>
          {JSON.parse(row.original.name!)?.ar} - {JSON.parse(row.original.name!)?.en}
        </p>
      },
      {
        header: `${t('package-management.package-price')}`,
        accessorKey: 'price',
        enableSorting: false
      },
      {
        header: `${t('package-management.package-currency')}`,
        accessorKey: 'currency',
        enableSorting: false,
        cell({ row }) {
          return <p>{i18n.language == 'ar' ? row.original.currency?.name : row.original.currency?.enName}</p>
        },
      },
      {
        header: `${t('package-management.Package duration')}`,
        accessorKey: 'duration',
        enableSorting: false,
        cell: ({ row }) => <p>
          {row.original.duration} {t('package-management.month')}
        </p>
      },
      {
        header: `${t('package-management.active')}`,
        accessorKey: 'active',
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Switcher
                checked={row.original.active}
                onChange={() => {
                  setSelectedRow(row.original)
                  openConfirmDialogActivate()
                }}
              />
            </div>
          )
        },
      },
      {
        header: '',
        accessorKey: 'action',
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Tooltip title={t('general.edit')}>
                <Button
                  shape="circle"
                  variant="twoTone"
                  size="sm"
                  icon={<MdEdit />}
                  onClick={() => {
                    openDialog()
                    setSelectedRow(row.original)
                  }}
                />
              </Tooltip>
              <Tooltip title={t('general.delete')}>
                <Button
                  shape="circle"
                  variant="twoTone"
                  size="sm"
                  color="red"
                  icon={<MdDelete />}
                  onClick={() => {
                    openConfirmDialog()
                    setSelectedRow(row.original)
                  }}
                />
              </Tooltip>
            </div>
          )
        },
      },
    ],
    [t]
  )

  // fetch Data
  const fetchPlans = async () => {
    try {
      const res = await apiGetPlans()
      if (res.status === 200) {
        setData(res.data)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchPlans()
  }, [])
  // fetch Data

  return (
    <>
      <Title Icon={GoPackage} title={`${t('nav.package-management')}`} />
      <div className="flex items-center justify-end my-4">
        <div className="flex items-center gap-2">
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => {
              openDialog()
            }}
          >
            {t('package-management.add-package')}
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
      />
      <ConfirmDialog
        isOpen={confirmdialogIsOpen}
        type="danger"
        confirmButtonColor="red-600"
        title={t('general.delete')}
        cancelText={t('general.cancel')}
        confirmText={t('general.delete')}
        onClose={handleClose}
        onRequestClose={handleClose}
        onCancel={handleClose}
        onConfirm={handleConfirm}
      >
        <p>{t('general.delete-Confirm-message')}</p>
      </ConfirmDialog>
      <ConfirmDialog
        isOpen={confirmdialogIsOpenisActive}
        type={selectedRow.active ? 'danger' : 'info'}
        confirmButtonColor={selectedRow.active ? 'red-600' : 'blue-600'}
        title={
          selectedRow.active
            ? t('general.deactivate')
            : t('general.activate')
        }
        cancelText={t('general.cancel')}
        confirmText={t('general.confirm')}
        onClose={handleCloseActivate}
        onRequestClose={handleCloseActivate}
        onCancel={handleCloseActivate}
        onConfirm={handleConfirmActivate}
      >
        <p>
          {' '}
          {selectedRow.active
            ? t(
              'products.are-you-sure-you-want-to-deactivate-this-product?'
            )
            : t(
              'products.are-you-sure-you-want-to-activate-this-product?'
            )}
        </p>
      </ConfirmDialog>
      <PackagesDialog
        dialogIsOpen={dialogIsOpen}
        onDialogeClose={onDialogClose}
        selectedRow={selectedRow}
        setSelectedRow={setSelecte}
        fetchClient={fetchPlans}
      />
    </>
  )
}

export default Packages