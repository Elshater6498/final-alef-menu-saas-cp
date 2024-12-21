import React, { useMemo, useState, useEffect } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type ExpandedState,
} from '@tanstack/react-table'
import { StarRating } from './components/StarRating'
import { EvaluationStats } from './components/EvaluationStats'
import { useTranslation } from 'react-i18next'
import Title from '@/components/shared/Title'
import { MdOutlineStarRate } from 'react-icons/md'
import { HiOutlineMinusCircle, HiOutlinePlusCircle } from 'react-icons/hi'
import { apiGetRates, transformRateToEvaluation } from '@/services/RateService'
import { MenuEvaluation } from '@/@types/rating'
import { Notification, Switcher, Table, Tag, toast } from '@/components/ui'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import dayjs from 'dayjs'
import useRestaurant from '@/utils/hooks/useRestaurant'
import { useAppSelector } from '@/store'

function Ratings() {
  const { t } = useTranslation()
  const [data, setData] = useState<MenuEvaluation[]>([])
  const [loading, setLoading] = useState(true)
  const { updateRestaurant } = useRestaurant()
  const showRating = useAppSelector((state) => state.restaurant.restaurant.showRates)

  const fetchRates = async () => {
    try {
      const response = await apiGetRates()
      const transformedData = transformRateToEvaluation(
        response.data
      )
      setData(transformedData)
    } catch (error) {
      console.error('Error fetching rates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [])

  const columns = useMemo<ColumnDef<MenuEvaluation>[]>(
    () => [
      {
        id: 'expander',
        header: ({ table }) => (
          <button
            className="text-xl text-gray-600 hover:text-gray-800"
            onClick={table.getToggleAllRowsExpandedHandler()}
          >
            {table.getIsAllRowsExpanded() ? (
              <HiOutlineMinusCircle />
            ) : (
              <HiOutlinePlusCircle />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <button
            className="text-xl text-gray-600 hover:text-gray-800"
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? (
              <HiOutlineMinusCircle />
            ) : (
              <HiOutlinePlusCircle />
            )}
          </button>
        ),
      },
      {
        header: `${t('rateing.name')}`,
        accessorKey: 'name',
      },
      {
        header: `${t('rateing.phone')}`,
        accessorKey: 'phone',
      },
      {
        header: `${t('rateing.email')}`,
        accessorKey: 'email',
      },
      {
        header: `${t('rateing.rate time')}`,
        accessorKey: 'createdAt',
        cell({ row }) {
          return <p>{dayjs(row.original.createdAt).format('DD/MM/YYYY LT')}</p>
        },
      },
      {
        header: `${t('rateing.rating')}`,
        accessorKey: 'stars',
        cell: ({ getValue }) => (
          <StarRating rating={getValue() as number} />
        ),
      },
    ],
    [t]
  )

  const handleSubmit = async (value : boolean) => {
    const formData = new FormData()
    formData.append(
        'showRates',
        `${value}`
    )
    const res = await updateRestaurant(formData)
    if (res?.status === 'success') {
        toast.push(
            <Notification title={`${t('general.success')}`} type="success">
                {t('general.edit-success')}
            </Notification>
        )
    } else {
        toast.push(
            <Notification title={`${t('general.error')}`} type="danger">
                {t('general.error-message')}
            </Notification>
        )
    }
}

  const [expanded, setExpanded] = useState<ExpandedState>({})

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

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <Title
            Icon={MdOutlineStarRate}
            title={`${t('nav.rateing')}`}
          />
          <div className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Title Icon={MdOutlineStarRate} title={`${t('nav.rateing')}`} />
      <EvaluationStats evaluations={data} />
      <Tag
        className={`${showRating
          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 gap-2 mb-2'
          : 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0 gap-2 mb-2'
          }`}
      >
        <Switcher
          color="emerald-500"
          defaultChecked={showRating}
          onChange={(value)=>{
            handleSubmit(value)
          }}
        />
        <span>
          {t(
              'rateing.(hide / show )the rating from the side menu'
            )}
        </span>
      </Tag>
      <div className="rounded-lg shadow-md overflow-hidden">
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <Tr>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
                {row.getIsExpanded() && (
                  <Tr>
                    <Td
                      colSpan={columns.length}
                      className="px-6 py-4"
                    >
                      <div className="text-sm">
                        <strong className="font-medium">
                          {t('rateing.comment')}
                        </strong>
                        <p className="mt-1">
                          {row.original.comment ||
                            t('rateing.no-comment')}
                        </p>
                      </div>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </TBody>
        </Table>
      </div>
    </>
  )
}

export default Ratings
