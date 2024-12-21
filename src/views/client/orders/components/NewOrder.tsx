import { Button, Notification, Table, Tooltip, toast } from '@/components/ui'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { order } from '@/@types/order'
import { apiGetOrder, apiUpdateOrder } from '@/services/OrderService'
import dayjs from 'dayjs'
import { useAppSelector } from '@/store'
import InfoBills from './InfoBills'
import { useTranslation } from 'react-i18next'

const { Tr, Th, Td, THead, TBody } = Table

const NewOrder = () => {
  const [data, setData] = useState<order[]>(() => [])
  const [dialogIsOpen, setdialogIsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<order | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const restaurantId = useAppSelector(
    (state) => state.restaurant.restaurant.id
  )
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
              <Tooltip title={t('general.Accept')}>
                <Button
                  shape="circle"
                  variant="twoTone"
                  color="green"
                  size="sm"
                  icon={<AiOutlineCheckCircle />}
                  onClick={() => {
                    acceptOrder(row.original.id!)
                  }}
                />
              </Tooltip>
              <Tooltip title={t('general.Accept')}>
                <Button
                  shape="circle"
                  variant="twoTone"
                  size="sm"
                  color="red"
                  icon={<AiOutlineCloseCircle />}
                  onClick={() => {
                    rejectedOrder(row.original.id!)
                  }}
                />
              </Tooltip>
            </div>
          )
        },
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  // handel Table

  // handel Change status Order
  const acceptOrder = async (id: string) => {
    const formdata = new FormData()
    formdata.append('status', `completed`)
    try {
      const res = await apiUpdateOrder(formdata, id)
      if (res.status === 200) {
        fetchOrder()
        toast.push(
          <Notification title={`${t('general.ok')}`} type="success">
            {t('general.delete-success')}.
          </Notification>
        )
      }
    } catch (error) {
      console.log(error)
      toast.push(
        <Notification title={`${t('general.error')}`} type="danger">
          {t('general.error-message')}.
        </Notification>
      )
    }
  }

  const rejectedOrder = async (id: string) => {
    const formdata = new FormData()
    formdata.append('status', `cancelled`)
    try {
      const res = await apiUpdateOrder(formdata, id)
      if (res.status === 200) {
        fetchOrder()
        toast.push(
          <Notification title={`${t('general.ok')}`} type="success">
            {t('general.delete-success')}.
          </Notification>
        )
      }
    } catch (error) {
      console.log(error)
      toast.push(
        <Notification title={`${t('general.error')}`} type="danger">
          {t('general.error-message')}.
        </Notification>
      )
    }
  }
  // handel Change status Order

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

  // fetch Data
  const fetchOrder = async () => {
    try {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)
      const res = await apiGetOrder({
        status: 'pending',
        from: dayjs(todayStart).format('YYYY-MM-DDTHH:mm:ss'),
        to: dayjs(todayEnd).format('YYYY-MM-DDTHH:mm:ss'),
      })
      if (res.status === 200) {
        setData(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket(
      `wss://saas.alefmenu.com/orders/ws?resid=${restaurantId}`
    )
    // Handle connection close
    socketRef.current.onopen = (e) => {
      fetchOrder()
      console.log(`WebSocket connection open ${e}`)
    }
    // Listen for messages
    socketRef.current.onmessage = (event) => {
      const newMessage = event.data
      fetchOrder()
      console.log(`WebSocket connection  ${event.data}`)
    }
    // Handle connection close
    socketRef.current.onclose = (e) => {
      console.log(`WebSocket connection closed ${e}`)
    }
    // Cleanup on component unmount
    return () => {
      socketRef.current?.close()
    }
  }, [])

  return (
    <>
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
              <Td colSpan={9} className="text-center">
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
                        'general.Add data or wait for it to be added'
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

export default NewOrder
