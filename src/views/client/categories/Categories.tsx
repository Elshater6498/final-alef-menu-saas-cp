import Title from '@/components/shared/Title'
import { useTranslation } from 'react-i18next'
import { useMemo, useState, useEffect } from 'react'
import {
    useReactTable,
    type ColumnDef,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import {
    Button,
    Notification,
    Switcher,
    Table,
    Tooltip,
    toast,
} from '@/components/ui'
import {
    MdDelete,
    MdDragIndicator,
    MdEdit,
    MdOutlineCategory,
} from 'react-icons/md'
import { ConfirmDialog, StrictModeDroppable } from '@/components/shared'
import CategoryDialog from './components/CategoryDialog'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { HiPlusCircle } from 'react-icons/hi'
import { Category, CategoryResponse } from '@/@types/category'
import {
    apiChangePostionCategory,
    apiDeleteCategory,
    apiGetCategory,
    apiUpdateCategory,
} from '@/services/CategoryService'
import { useAppSelector } from '@/store'

const { Tr, Th, Td, THead, TBody } = Table

const Categories = () => {
    const { t } = useTranslation()
    const [data, setData] = useState<CategoryResponse>(() => [])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogIsOpen, setdialogIsOpen] = useState(false)
    const [changePostionIsOpen, setChangePostionIsOpen] = useState(false)
    const [isPosition, setIsPosition] = useState(false)
    const [selectedRow, setSelectedRow] = useState<Category>({})
    const [confirmdialogIsOpen, setConfirmdialogIsOpen] = useState(false)
    const [confirmdialogIsOpenisActive, setConfirmdialogIsOpenisActive] =
        useState(false)
    const restaurantId = useAppSelector(
        (state) => state.restaurant.restaurant.id
    )
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
        try {
            const res = await apiDeleteCategory(selectedRow)
            if (res.status === 204) {
                await fetchCategories()
                handleClose()
                toast.push(
                    <Notification title={`${t('general.ok')}`} type="success">
                        {t('general.delete-success')}.
                    </Notification>
                )
                setSelectedRow({
                    name: '',
                })
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
            const response = await apiUpdateCategory(formdata, selectedRow.id!)
            if (response.status === 200) {
                handleCloseActivate()
                await fetchCategories()
                toast.push(
                    <Notification title={`${t('general.ok')}`} type="success">
                        {selectedRow.active
                            ? t('general.deactivate-success')
                            : t('general.activate-success')}
                    </Notification>
                )
                setSelectedRow({
                    id: '',
                    name: '',
                    active: true,
                })
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

    // change positon
    const openChangePostionDialog = () => {
        setChangePostionIsOpen(true)
    }
    const handleCloseChangePostion = () => {
        setChangePostionIsOpen(false)
    }
    const handleConfirmChangePostion = async () => {
        const newcategoryList = []
        try {
            for (let i = 0; i < data.length; i++) {
                newcategoryList.push({
                    id: data[i].id!,
                    sort: i + 1,
                })
            }
            const res = await apiChangePostionCategory(newcategoryList)
            if (res.status === 200) {
                await fetchCategories()
                handleCloseChangePostion()
                setIsPosition(false)
                toast.push(
                    <Notification title={`${t('general.ok')}`} type="success">
                        {t('general.rearrangement-success')}.
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
    // change positon

    // handel Table
    const columns = useMemo<ColumnDef<Category>[]>(
        () => [
            {
                id: 'dragger',
                header: '',
                accessorKey: 'dragger',
                cell: (props) => (
                    <span {...(props as any).dragHandleProps}>
                        <MdDragIndicator />
                    </span>
                ),
            },
            {
                header: `${t('categories.category-name')}`,
                accessorKey: 'name',
                cell: (props) => {
                    const parsedData = JSON.parse(props.row.original.name!)
                    return <p>{parsedData.ar}</p>
                },
            },
            {
                header: `${t('categories.category-name-en')}`,
                accessorKey: 'name',
                cell: (props) => {
                    const parsedData = JSON.parse(props.row.original.name!)
                    return <p>{parsedData.en}</p>
                },
            },
            {
                header: `${t('categories.category-status')}`,
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...data]
        const [movedRow] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedRow)
        setData(newData)
        setIsPosition(true)
    }

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return
        reorderData(source.index, destination.index)
    }
    // handel Table

    // fetch Data
    const fetchCategories = async () => {
        try {
            const res = await apiGetCategory(restaurantId!)
            if (res.status === 200) {
                setData(res.data)
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchCategories()
    }, [])
    // fetch Data

    return (
        <>
            <Title Icon={MdOutlineCategory} title={`${t('nav.categories')}`} />
            <div className="flex items-center justify-end my-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => openDialog()}
                    >
                        {t('categories.add-category')}
                    </Button>
                </div>
            </div>
            <div>
                <Table className="w-full">
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
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
                    {isLoading ? (
                        <TableRowSkeleton columns={5} rows={10} />
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <StrictModeDroppable droppableId="table-body">
                                {(provided) => (
                                    <TBody
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {table.getRowModel().rows.length ===
                                        0 ? (
                                            <Tr>
                                                <Td
                                                    colSpan={5}
                                                    className={
                                                        'text-center text-xl font-semibold'
                                                    }
                                                >
                                                    <div className="h-full flex flex-col items-center justify-center">
                                                        {/* <DoubleSidedImage
                                                            src="/img/others/no-notification.png"
                                                            darkModeSrc="/img/others/no-notification.png"
                                                            alt="Access Denied!"
                                                            className="h-[200px]"
                                                        /> */}
                                                        <div className="mt-6 text-center">
                                                            <h3 className="mb-2">
                                                                {t(
                                                                    'general.No data!'
                                                                )}
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
                                            table
                                                .getRowModel()
                                                .rows.map((row) => {
                                                    return (
                                                        <Draggable
                                                            key={row.id}
                                                            draggableId={row.id}
                                                            index={row.index}
                                                        >
                                                            {(
                                                                provided,
                                                                snapshot
                                                            ) => {
                                                                const {
                                                                    style,
                                                                } =
                                                                    provided.draggableProps
                                                                return (
                                                                    <Tr
                                                                        ref={
                                                                            provided.innerRef
                                                                        }
                                                                        className={
                                                                            snapshot.isDragging
                                                                                ? 'table'
                                                                                : ''
                                                                        }
                                                                        style={
                                                                            style
                                                                        }
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        {row
                                                                            .getVisibleCells()
                                                                            .map(
                                                                                (
                                                                                    cell
                                                                                ) => {
                                                                                    return (
                                                                                        <Td
                                                                                            key={
                                                                                                cell.id
                                                                                            }
                                                                                        >
                                                                                            {flexRender(
                                                                                                cell
                                                                                                    .column
                                                                                                    .columnDef
                                                                                                    .cell,
                                                                                                cell.getContext()
                                                                                            )}
                                                                                        </Td>
                                                                                    )
                                                                                }
                                                                            )}
                                                                    </Tr>
                                                                )
                                                            }}
                                                        </Draggable>
                                                    )
                                                })
                                        )}
                                        {provided.placeholder}
                                    </TBody>
                                )}
                            </StrictModeDroppable>
                        </DragDropContext>
                    )}
                </Table>
                {isPosition && (
                    <div className="w-full flex justify-end my-2">
                        <Button
                            variant="solid"
                            onClick={openChangePostionDialog}
                        >
                            {t('general.save-arrangement')}
                        </Button>
                    </div>
                )}
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
                    isOpen={changePostionIsOpen}
                    type="info"
                    title={t('general.rearrangement')}
                    cancelText={t('general.cancel')}
                    confirmText={t('general.confirm')}
                    onClose={handleCloseChangePostion}
                    onRequestClose={handleCloseChangePostion}
                    onCancel={handleCloseChangePostion}
                    onConfirm={handleConfirmChangePostion}
                >
                    <p>
                        {t(
                            'categories.are-you-sure-you-want-to-rearrange-the-sections?'
                        )}
                    </p>
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
                <CategoryDialog
                    dialogIsOpen={dialogIsOpen}
                    onDialogeClose={onDialogClose}
                    selectedRow={selectedRow}
                    setSelectedRow={setSelecte}
                    fetchCategories={fetchCategories}
                />
            </div>
        </>
    )
}

export default Categories
