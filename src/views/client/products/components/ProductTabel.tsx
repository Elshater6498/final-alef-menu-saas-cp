import { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Dispatch, SetStateAction } from 'react'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Button, Notification, Switcher, Tooltip, toast } from '@/components/ui'
import { MdDelete, MdDragIndicator, MdEdit } from 'react-icons/md'
import { ConfirmDialog, StrictModeDroppable } from '@/components/shared'
import { HiPlusCircle } from 'react-icons/hi'
import ProductDialog from './ProductDialog'
import {
    apiChangePostionProduct,
    apiDeleteProduct,
    apiUpdateProduct,
} from '@/services/ProductService'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { Product } from '@/@types/Product'
import { useTranslation } from 'react-i18next'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

type Props = {
    getProduct: (id: string) => Promise<void>
    productList: Product[]
    setProductList: Dispatch<SetStateAction<Product[]>>
    categoryId: string
    isLoading: boolean
}
const ProductTabel = (props: Props) => {
    const { t } = useTranslation()
    const [dialogIsOpen, setdialogIsOpen] = useState(false)
    const [confirmdialogIsOpen, setConfirmdialogIsOpen] = useState(false)
    const [confirmdialogIsOpenisActive, setConfirmdialogIsOpenisActive] =
        useState(false)
    const [changePostionIsOpen, setChangePostionIsOpen] = useState(false)
    const [isPosition, setIsPosition] = useState(false)
    const [selectedRow, setSelectedRow] = useState<Product>({
        id: '',
        name: '',
        image: '',
        details: '',
        price: 0,
        calories: 0,
    })
    //Add and edit
    const openDialog = () => {
        setdialogIsOpen(true)
    }
    const onDialogClose = () => {
        setdialogIsOpen(false)
    }
    const setSelecte = () => {
        setSelectedRow({
            id: '',
            name: '',
            image: '',
            details: '',
            price: 0,
            calories: 0,
        })
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
            const res = await apiDeleteProduct(selectedRow)
            if (res.status === 204) {
                await props.getProduct(props.categoryId)
                handleClose()
                setSelectedRow({
                    id: '',
                    name: '',
                    image: '',
                    details: '',
                    price: 0,
                    calories: 0,
                })
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
            const response = await apiUpdateProduct(formdata, selectedRow.id!)
            if (response.status === 200) {
                handleCloseActivate()
                await props.getProduct(props.categoryId)
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
                    image: '',
                    details: '',
                    price: 0,
                    calories: 0,
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
            for (let i = 0; i < props.productList.length; i++) {
                newcategoryList.push({
                    id: props.productList[i].id!,
                    sort: i + 1,
                })
            }
            const res = await apiChangePostionProduct(newcategoryList)
            if (res.status === 200) {
                await getproduct2()
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
    const columns = useMemo<ColumnDef<Product>[]>(
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
                header: `${t('products.product-name')}`,
                accessorKey: 'name',
                cell(props) {
                    const parsedData = JSON.parse(props.row.original.name!)
                    return <p>{parsedData.ar}</p>
                },
            },
            {
                header: `${t('products.product-name-en')}`,
                accessorKey: 'enName',
                cell(props) {
                    const parsedData = JSON.parse(props.row.original.name!)
                    return <p>{parsedData.en}</p>
                },
            },
            {
                header: `${t('products.product-status')}`,
                accessorKey: 'active',
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-3">
                            <Switcher
                                checked={row.original.active}
                                onChange={() => {
                                    openConfirmDialogActivate()
                                    setSelectedRow(row.original)
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
        data: props.productList,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...props.productList]
        const [movedRow] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedRow)
        props.setProductList(newData)
        setIsPosition(true)
    }

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return
        reorderData(source.index, destination.index)
    }
    // handel Table

    const getproduct2 = async () => {
        await props.getProduct(props.categoryId)
    }

    return (
        <div>
            <div className="flex items-center justify-end my-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => openDialog()}
                    >
                        {t('products.add-product')}
                    </Button>
                </div>
            </div>
            <Table className="w-full">
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
                {props.isLoading ? (
                    <TableRowSkeleton columns={8} rows={10} />
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <StrictModeDroppable droppableId="table-body">
                            {(provided) => (
                                <TBody
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {table.getRowModel().rows.length === 0 ? (
                                        <Tr>
                                            <Td
                                                colSpan={8}
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
                                        table.getRowModel().rows.map((row) => {
                                            return (
                                                <Draggable
                                                    key={row.id}
                                                    draggableId={row.id}
                                                    index={row.index}
                                                >
                                                    {(provided, snapshot) => {
                                                        const { style } =
                                                            provided.draggableProps
                                                        return (
                                                            <Tr
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                className={
                                                                    snapshot.isDragging
                                                                        ? 'table whitespace-nowrap'
                                                                        : 'whitespace-nowrap'
                                                                }
                                                                style={style}
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
                    <Button variant="solid" onClick={openChangePostionDialog}>
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
                        'products.are-you-sure-you-want-to-rearrange-the-products?'
                    )}
                </p>
            </ConfirmDialog>
            <ProductDialog
                dialogIsOpen={dialogIsOpen}
                onDialogeClose={onDialogClose}
                selectedRow={selectedRow}
                setSelectedRow={setSelecte}
                getProduct={getproduct2}
                categoryId={props.categoryId}
            />
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
        </div>
    )
}

export default ProductTabel
