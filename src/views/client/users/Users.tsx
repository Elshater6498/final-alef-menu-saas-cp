import { UserInfo } from "@/@types/userInfo"
import { ConfirmDialog, DataTable } from "@/components/shared"
import Title from "@/components/shared/Title"
import { Button, Notification, Switcher, toast, Tooltip } from "@/components/ui"
import { apiGetUserByRole, apiUpdateUser } from "@/services/UserService"
import { ColumnDef } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai"
import { HiPlusCircle } from "react-icons/hi"
import { MdEdit, MdOutlineAdminPanelSettings } from "react-icons/md"
import UsersDialog from "./components/userDialog"


const Users = () => {
  const { t } = useTranslation()
  const [data, setData] = useState<UserInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState<UserInfo>({})
  const [dialogIsOpen, setdialogIsOpen] = useState(false)
  const [confirmdialogIsOpen, setConfirmdialogIsOpen] = useState(false)
  const [confirmdialogIsOpenisActive, setConfirmdialogIsOpenisActive] =
    useState(false)
  const [tableData, setTableData] = useState<{
    pageIndex: number
    pageSize: number
    total: number
  }>({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  })

  // handel Table
  const columns = useMemo<ColumnDef<UserInfo>[]>(
    () => [
      {
        header: `${t('admin-management.user-name')}`,
        accessorKey: 'name',
        enableSorting: false
      },
      {
        header: `${t('admin-management.user-email')}`,
        accessorKey: 'email',
        enableSorting: false
      },
      {
        header: `${t('admin-management.user-phone')}`,
        accessorKey: 'phone',
        enableSorting: false
      },
      {
        header: `${t('admin-management.verified')}`,
        accessorKey: 'verified',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.verified ? (
            <AiOutlineCheckCircle className="text-green-600 text-lg" />
          ) : (
            <AiOutlineCloseCircle className="text-red-600 text-lg" />
          ),
      },
      {
        header: `${t('admin-management.active')}`,
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
              {/* <Tooltip title={t('general.delete')}>
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
              </Tooltip> */}
            </div>
          )
        },
      },
    ],
    [t]
  )

  const handlePaginationChange = (pageIndex: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
  }

  const handleSelectChange = (pageSize: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageSize } }))
  }

  //Add and edit
  const openDialog = () => {
    setdialogIsOpen(true)
  }
  const onDialogClose = () => {
    setdialogIsOpen(false)
  }
  const setSelecte = () => {
    setSelectedRow({ name: '' })
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
    try {
      const response = await apiUpdateUser(formdata, selectedRow.id!)
      if (response.status === 200) {
        handleCloseActivate()
        await fetchUser()
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

  // fetch Data
  const fetchUser = async () => {
    try {
      const res = await apiGetUserByRole({ role: 4 })
      if (res.status === 200) {
        setData(res.data.items!)
        setTableData((prevData) => ({
          ...prevData,
          ...{ total: res.data.total! },
        }))
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [
    tableData.pageIndex,
    tableData.pageSize,
    t
  ])
  // fetch Data
  return (
    <>
      <Title
        Icon={MdOutlineAdminPanelSettings}
        title={`${t('nav.admin-management')}`}
      />
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
            {t('admin-management.add-user')}
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={isLoading}
        pagingData={{
          total: tableData.total,
          pageIndex: tableData.pageIndex,
          pageSize: tableData.pageSize,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handleSelectChange}
      />
      <UsersDialog
        dialogIsOpen={dialogIsOpen}
        onDialogeClose={onDialogClose}
        selectedRow={selectedRow}
        setSelectedRow={setSelecte}
        fetchClient={fetchUser}
      />
      <ConfirmDialog
        isOpen={confirmdialogIsOpenisActive}
        type={selectedRow.active ? 'danger' : 'info'}
        confirmButtonColor={
          selectedRow.active ? 'red-600' : 'blue-600'
        }
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
              'categories.are-you-sure-you-want-to-deactivate-this-section?'
            )
            : t(
              'categories.are-you-sure-you-want-to-activate-this-section?'
            )}
        </p>
      </ConfirmDialog>
    </>
  )
}

export default Users
