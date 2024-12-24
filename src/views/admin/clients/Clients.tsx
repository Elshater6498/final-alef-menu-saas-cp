import { UserInfo } from '@/@types/userInfo'
import { ConfirmDialog } from '@/components/shared'
import Title from '@/components/shared/Title'
import {
  Avatar,
  Button,
  Card,
  Notification,
  Pagination,
  Select,
  Switcher,
  Table,
  toast,
  Tooltip,
} from '@/components/ui'
import { apiGetUserByRole, apiUpdateUser } from '@/services/UserService'
import {
  ColumnDef,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import {
  HiEye,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineEye,
  HiOutlineUser,
  HiPlusCircle,
} from 'react-icons/hi'
import { MdDelete, MdEdit, MdPassword, MdPersonOutline } from 'react-icons/md'
import ClientDialog from './components/ClientDialog'
import appConfig from '@/configs/app.config'
import { BsEye } from 'react-icons/bs'
import ExportToCSVBtn from '@/components/shared/ExportToCSVBtn'
import ChangePasswordDialog from './components/ChangePasswordDialog'
const { Tr, Th, Td, THead, TBody } = Table

const Clients = () => {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<UserInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState<UserInfo>({})
  const [expanded, setExpanded] = useState<ExpandedState>({})
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
        id: 'expander',
        header: ({ table }) => (
          <button
            className="text-xl text-gray-600 hover:text-gray-800"
            onClick={table.getToggleAllRowsExpandedHandler()}
          >
            {table.getIsAllRowsExpanded() ? (
              <HiOutlineChevronDown />
            ) : (
              <HiOutlineChevronRight />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <button
            className="text-xl text-gray-600 hover:text-gray-800"
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? (
              <HiOutlineChevronDown />
            ) : (
              <HiOutlineChevronRight />
            )}
          </button>
        ),
      },
      {
        header: `${t('client-management.client-name')}`,
        accessorKey: 'name',
      },
      {
        header: `${t('client-management.client-email')}`,
        accessorKey: 'email',
      },
      {
        header: `${t('client-management.client-phone')}`,
        accessorKey: 'phone',
      },
      {
        header: `${t('client-management.client-country')}`,
        accessorKey: 'country',
      },
      {
        header: `${t('client-management.client-city')}`,
        accessorKey: 'city',
      },
      {
        header: `${t('package-management.package-price')}`,
        accessorKey: 'planPrice',
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
        header: `${t('client-management.verified')}`,
        accessorKey: 'verified',
        cell: ({ row }) =>
          row.original.verified ? (
            <AiOutlineCheckCircle className="text-green-600 text-lg" />
          ) : (
            <AiOutlineCloseCircle className="text-red-600 text-lg" />
          ),
      },
      {
        header: `${t('client-management.dueDate')}`,
        accessorKey: 'dueDate',
        cell: ({ row }) => (
          <p>
            {dayjs(row.original.dueDate).format('DD / MM / YYYY')}
          </p>
        ),
      },
      {
        header: `${t('client-management.active')}`,
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

              <Button
                shape="circle"
                variant="twoTone"
                color='orange'
                size="sm"
                icon={<MdPassword />}
                onClick={() => {
                  openDialogChangePassword()
                  setSelectedRow(row.original)
                }}
              />
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

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })
  // handel Table

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

  // delete
  const openConfirmDialog = () => {
    setConfirmdialogIsOpen(true)
  }
  const handleClose = () => {
    setConfirmdialogIsOpen(false)
  }
  const handleConfirm = async () => {
    // try {
    //   const res = await apiDeleteCategory(selectedRow)
    //   if (res.status === 202) {
    //     await fetchUser()
    //     handleClose()
    //     toast.push(
    //       <Notification title={`${t('general.ok')}`} type="success">
    //         {t('general.delete-success')}.
    //       </Notification>
    //     )
    //     setSelectedRow({})
    //   }
    // } catch (error) {
    //   toast.push(
    //     <Notification title={`${t('general.error')}`} type="danger">
    //       {t('general.error-message')}.
    //     </Notification>
    //   )
    // }
  }
  // delete

  const handlePaginationChange = (pageIndex: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageIndex } }))
  }

  const handleSelectChange = (pageSize: number) => {
    setTableData((prevData) => ({ ...prevData, ...{ pageSize } }))
  }

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
  const pageSizes = [10, 25, 50, 100]
  const pageSizeOption = useMemo(
    () =>
      pageSizes.map((number) => ({
        value: number,
        label: `${number} / page`,
      })),
    [pageSizes]
  )
  const [dialogIsOpenChangePassword, setdialogIsOpenChangePassword] =
    useState(false)
  // handel Dialog change password
  const openDialogChangePassword = () => {
    setdialogIsOpenChangePassword(true)
  }
  const onDialogCloseChangePassword = () => {
    setdialogIsOpenChangePassword(false)
  }
  // handel Dialog change password
  // fetch Data
  const fetchUser = async () => {
    try {
      const res = await apiGetUserByRole({ role: 3 })
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
  }, [tableData.pageIndex, tableData.pageSize, t])
  // fetch Data


  return (
    <>
      <Title
        Icon={MdPersonOutline}
        title={`${t('nav.client-management')}`}
      />
      <div className="flex items-center justify-end my-4">
        <div className="flex items-center gap-2">
          <ExportToCSVBtn
            data={[
              ...data.map((item, i) => ({
                ...item,
                currency: item.currency?.name
              })),
            ]}
            filename="order data"
          />
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => {
              openDialog()
            }}
          >
            {t('client-management.add-client')}
          </Button>
        </div>
      </div>
      <div>
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr
                key={headerGroup.id}
                className="whitespace-nowrap"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map((row) => {
              const restaurant = row.original.restaurant
              const name = JSON.parse(restaurant?.name!)
                .ar as string
              const enName = JSON.parse(restaurant?.name!)
                .en as string
              try {
              } catch (error) { }
              return (
                <Fragment key={row.id}>
                  <Tr>
                    {/* first row is a normal row */}
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef
                              .cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </Tr>
                  {row.getIsExpanded() && (
                    <Tr>
                      {/* 2nd row is a custom 1 cell row */}
                      <Td colSpan={columns.length}>
                        <Card>
                          <div className="w-full flex gap-4 justify-between">
                            <Avatar
                              size={120}
                              icon={
                                <HiOutlineUser />
                              }
                              src={
                                appConfig.apiPrefix +
                                restaurant?.image
                              }
                            />
                            <div className="w-full flex flex-col gap-2">
                              <h6>
                                {name} -{' '}
                                {enName}
                              </h6>
                              <div className="w-full flex gap-4">
                                <div className="flex flex-col gap-2">
                                  <p>
                                    {t(
                                      'client-home.identity-customization.WhatsApp number'
                                    )}{' '}
                                    :{' '}
                                    {
                                      restaurant?.whatsapp
                                    }
                                  </p>
                                  <p>
                                    {t(
                                      'client-home.identity-customization.phone number'
                                    )}{' '}
                                    :{' '}
                                    {
                                      restaurant?.phone
                                    }
                                  </p>
                                  <p>
                                    {t(
                                      'client-management.default language'
                                    )}{' '}
                                    :{' '}
                                    {
                                      restaurant?.defaultLanguage
                                    }
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <p>
                                    {t(
                                      'client-management.currency'
                                    )}{' '}
                                    :{' '}
                                    {
                                      restaurant
                                        ?.currency
                                        ?.name
                                    }{' '}
                                    -{' '}
                                    {
                                      restaurant
                                        ?.currency
                                        ?.enName
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="w-full flex justify-end items-start">
                              <a
                                href={`${appConfig.mainurl}${restaurant?.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-fit flex gap-2 items-center justify-center border border-gray-100 rounded-full py-2 px-5"
                              >
                                <BsEye />
                                <span>
                                  {i18n.language ===
                                    'ar'
                                    ? 'زيارة القائمة'
                                    : 'Visit Menu'}
                                </span>
                              </a>
                            </div>
                          </div>
                        </Card>
                      </Td>
                    </Tr>
                  )}
                </Fragment>
              )
            })}
          </TBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <Pagination
            pageSize={tableData.pageSize}
            currentPage={tableData.pageIndex}
            total={tableData.total}
            onChange={handlePaginationChange}
          />
          <div style={{ minWidth: 130 }}>
            <Select
              size="sm"
              menuPlacement="top"
              isSearchable={false}
              value={pageSizeOption.filter(
                (option) => option.value === tableData.pageSize
              )}
              options={pageSizeOption}
              onChange={(option) =>
                handleSelectChange(option?.value!)
              }
            />
          </div>
        </div>
        <ClientDialog
          dialogIsOpen={dialogIsOpen}
          onDialogeClose={onDialogClose}
          selectedRow={selectedRow}
          setSelectedRow={setSelecte}
          fetchClient={fetchUser}
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
        <ChangePasswordDialog
          dialogIsOpen={dialogIsOpenChangePassword}
          onDialogeClose={onDialogCloseChangePassword}
          selectedRow={selectedRow}
        />
      </div>
    </>
  )
}

export default Clients
