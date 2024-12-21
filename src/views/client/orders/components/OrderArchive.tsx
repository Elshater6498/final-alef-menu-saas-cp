import { Button, Notification, Table, Tag, Tooltip, toast } from '@/components/ui'
import DatePickerRange from '@/components/ui/DatePicker/DatePickerRange'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import InfoBills from './InfoBills'
import { order } from '@/@types/order'
import { useAppSelector } from '@/store'
import { useTranslation } from 'react-i18next'
import { apiGetOrder } from '@/services/OrderService'
import ExportToCSVBtn from '@/components/shared/ExportToCSVBtn'

const { Tr, Th, Td, THead, TBody } = Table

const OrderArchive = () => {
  const [data, setData] = useState<order[]>(() => [])
  const [From, setfrom] = useState('')
  const [to, setTo] = useState('')
  const [dialogIsOpen, setdialogIsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<order | null>(null)
  const restaurant = useAppSelector((state) => state.restaurant.restaurant)
  const { t, i18n } = useTranslation()
  // handel Table
  const columns = useMemo<ColumnDef<order>[]>(
    () => [
      {
        header: `#`,
        accessorKey: 'id',
      },
      {
        header: `${t('orders.customerName')}`,
        accessorKey: 'customerName',
      },
      {
        header: `${t('orders.orderType')}`,
        accessorKey: 'orderType',
        cell: ({ row }) => (
          <p>
            {row.original.orderType === 'inRestaurant' &&
              t('orders.inRestaurant')}{' '}
            {row.original.orderType === 'delivery' &&
              t('orders.delivery')}{' '}
            {row.original.orderType === 'takeaway' &&
              t('orders.takeaway')}
          </p>
        ),
      },
      {
        header: `${t('orders.customerPhone')}`,
        accessorKey: 'customerPhone',
        cell: ({ row }) => (
          <p>
            {row.original.customerPhone
              ? row.original.customerPhone
              : '----'}
          </p>
        ),
      },
      {
        header: `${t('orders.customerAddress')}`,
        accessorKey: 'customerAddress',
        cell: ({ row }) => (
          <p>
            {row.original.customerAddress
              ? row.original.customerAddress
              : '----'}
          </p>
        ),
      },
      {
        header: `${t('orders.tableNumber')}`,
        accessorKey: 'tableNumber',
        cell: ({ row }) => (
          <p>
            {row.original.tableNumber
              ? `${row.original.tableNumber}`
              : '----'}
          </p>
        ),
      },
      {
        header: `${t('orders.status')}`,
        accessorKey: 'status',
        cell: ({ row }) => (
          <div>
            {row.original.status == "pending" && <Tag className="text-orange-600 bg-orange-100 dark:text-orange-100 dark:bg-orange-500/20 border-0">
              {t('orders.pending')}
            </Tag>}
            {row.original.status == "cancelled" && <Tag className="text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0">
              {t('orders.cancelled')}
            </Tag>}
            {row.original.status == "completed" && <Tag className="text-teal-600 bg-teal-100 dark:text-teal-100 dark:bg-teal-500/20 border-0">
              {t('orders.completed')}
            </Tag>}
          </div>
        ),
      },
      {
        header: `${t('orders.totalPrice')}`,
        accessorKey: 'totalPrice',
        cell: ({ row }) => (
          <p>
            {row.original.totalPrice}{' '}
            {i18n.language == 'ar'
              ? restaurant.currency?.name
              : restaurant.currency?.enName}
          </p>
        ),
      },
      {
        header: `${t('orders.Order time')}`,
        accessorKey: 'createdAt',
        cell: ({ row }) => (
          <p>
            {dayjs(row.original.createdAt).format('DD/MM/YYYY LT')}
          </p>
        ),
      },
      {
        header: `${t('orders.notes')}`,
        accessorKey: 'notes',
        cell: ({ row }) => (
          <p>
            {row.original.notes
              ? `${row.original.notes}`
              : '----'}
          </p>
        ),
      },
      {
        header: '',
        accessorKey: 'action',
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-3">
              <Tooltip title={t('general.view')}>
                <Button
                  shape="circle"
                  variant="twoTone"
                  color="blue"
                  size="sm"
                  icon={<MdOutlineRemoveRedEye />}
                  onClick={() => {
                    openDialog(row.original)
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  // handel Table

  // handel get Data
  const getmonthOrder = async () => {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const numperofday = new Date(year, month, 0).getDate()
    let fromDay = `${year}-${month < 10 ? `0${month}` : month}-01T00:00`
    let toDay = `${year}-${month < 10 ? `0${month}` : month
      }-${numperofday}T23:59`
    try {
      const res = await apiGetOrder({
        status: '',
        from: dayjs(fromDay).format('YYYY-MM-DDTHH:mm:ss'),
        to: dayjs(toDay).format('YYYY-MM-DDTHH:mm:ss'),
      })
      if (res.status === 200) {
        setData(res.data)
      }
    } catch (error) {
      toast.push(
        <Notification title={'حدث خطا'} type="danger">
          {'حدث خطا بالرجاء المحاولة مره اخري'}.
        </Notification>
      )
    }
  }

  const getdayOrder = async () => {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    const day = new Date().getDate()
    let fromDay = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day
      }T00:00`
    let toDay = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day
      }T23:59`
    try {
      const res = await apiGetOrder({
        status: '',
        from: dayjs(fromDay).format('YYYY-MM-DDTHH:mm:ss'),
        to: dayjs(toDay).format('YYYY-MM-DDTHH:mm:ss'),
      })
      if (res.status === 200) {
        setData(res.data)
      }
    } catch (error) {
      toast.push(
        <Notification title={'حدث خطا'} type="danger">
          {'حدث خطا بالرجاء المحاولة مره اخري'}.
        </Notification>
      )
    }
  }

  const getOrderbyRange = async () => {
    try {
      if (From && to) {
        const res = await apiGetOrder({
          status: '',
          from: dayjs(From).format('YYYY-MM-DDTHH:mm:ss'),
          to: dayjs(to).format('YYYY-MM-DDTHH:mm:ss'),
        })
        if (res.status === 200) {
          setData(res.data)
        }
      } else {
        toast.push(
          <Notification title={'خطأ'} type="danger">
            يجب عليك اختيار المدة اولا
          </Notification>
        )
      }
    } catch (error) {
      toast.push(
        <Notification title={'حدث خطا'} type="danger">
          {'حدث خطا بالرجاء المحاولة مره اخري'}.
        </Notification>
      )
    }
  }
  // handel get Data

  //open  Dialog
  const openDialog = (order: order) => {
    setdialogIsOpen(true)
    setSelectedRow(order)
  }
  const onDialogClose = () => {
    setdialogIsOpen(false)
  }
  const setSelecte = () => {
    setSelectedRow(null)
  }
  //open  Dialog

  useEffect(() => {
    getdayOrder()
  }, [])

  return (
    <>
      <div className="flex flex-col sm:flex-row my-5 gap-2">
        <div className="flex-1 flex-col sm:flex-row flex gap-4">
          <Button
            size="sm"
            variant="solid"
            onClick={() => {
              getdayOrder()
            }}
          >
            {t("orders.View today's orders")}
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={() => {
              getmonthOrder()
            }}
          >
            {t("orders.View this month's orders")}
          </Button>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <DatePickerRange
            size="sm"
            dateViewCount={2}
            placeholder={`${t(
              'orders.Choose the required period'
            )}`}
            onChange={(data) => {
              if (data[0] && data[1]) {
                setfrom(
                  dayjs(data[0]).format('YYYY-MM-DDTHH:mm:ss')
                )
                setTo(
                  `${dayjs(data[1]).format(
                    'YYYY-MM-DD'
                  )}T23:59:58`
                )
              }
            }}
          />
          <Button
            variant="solid"
            size="sm"
            onClick={() => {
              getOrderbyRange()
            }}
          >
            {t('orders.View orders')}
          </Button>
          <ExportToCSVBtn
            data={[
              ...data.map((item, i) => ({
                customerName: item.customerName,
                customerAddress: item.customerAddress,
                customerPhone: item.customerPhone,
                totalPrice: item.totalPrice,
                status: item.status,
                orderType: item.orderType === 'inRestaurant' ?
                  t('orders.inRestaurant') : item.orderType === 'delivery' ? t('orders.delivery') : t('orders.takeaway'),
                tableNumber: item.tableNumber,
                createdAt: item.createdAt
              })),
            ]}
            filename="order data"
          />
        </div>
      </div>
      <Table>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id} className="whitespace-nowrap">
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
          {table.getRowModel().rows.length === 0 ? (
            <Tr>
              <Td colSpan={8} className="text-center">
                <div className="h-full flex flex-col items-center justify-center">
                  {/* <DoubleSidedImage
                                        src="/img/others/no-notification.png"
                                        darkModeSrc="/img/others/no-notification.png"
                                        alt="Access Denied!"
                                        className="h-[200px]"
                                    /> */}
                  <div className="mt-6 text-center">
                    <h3 className="mb-2">
                      {t('general.No data!')}
                    </h3>
                    <p className="text-base">
                      {t(
                        'orders.There are no requests during this period. Please choose another time'
                      )}
                    </p>
                  </div>
                </div>
              </Td>
            </Tr>
          ) : (
            table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id} className="whitespace-nowrap">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })
          )}
        </TBody>
      </Table>
      <InfoBills
        closeDialoge={onDialogClose}
        isOpen={dialogIsOpen}
        selectedBills={selectedRow!}
        setSelecte={setSelecte}
      />
    </>
  )
}

export default OrderArchive
