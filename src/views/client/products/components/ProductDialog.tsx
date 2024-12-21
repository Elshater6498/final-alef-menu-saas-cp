import {
    Avatar,
    Button,
    Dialog,
    FormContainer,
    FormItem,
    Input,
    Notification,
    Upload,
    toast,
} from '@/components/ui'
import appConfig from '@/configs/app.config'
import { apiCreateProduct, apiUpdateProduct } from '@/services/ProductService'
import { Product } from '@/@types/product'
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik'
import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

type Props = {
    dialogIsOpen: boolean
    onDialogeClose: () => void
    getProduct: () => Promise<void>
    selectedRow: Product
    setSelectedRow: () => void
    categoryId: string
}

const ProductDialog = (props: Props) => {
    const { t } = useTranslation()
    const validationSchema = Yup.object().shape({
        arName: Yup.string().required(`${t('general.field-is-required')}`),
        enName: Yup.string().required(`${t('general.field-is-required')}`),
        image: Yup.mixed()
            .nullable()
            .required(`${t('general.field-is-required')}`),
        price: Yup.number().required(`${t('general.field-is-required')}`),
        arDetails: Yup.string(),
        enDetails: Yup.string(),
        calories: Yup.number(),
    })
    const [avatarImg, setAvatarImg] = useState<string | null>(null)
    const onFileUpload = (
        files: File[],
        setFieldValue: (
            field: string,
            value: File | null,
            shouldValidate?: boolean | undefined
        ) => Promise<void | FormikErrors<formTypes>>
    ) => {
        if (files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            setFieldValue('image', files[0])
        }
    }
    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = `${t('general.image-error')}`
                }
            }
        }
        return valid
    }
    type formTypes = {
        arName: string
        enName: string
        enDetails: string
        arDetails: string
        image?: string
        price?: number
        calories?: number
    }
    const initialValues = {
        arName: props.selectedRow.name
            ? JSON.parse(props.selectedRow.name).ar
            : '',
        enName: props.selectedRow.name
            ? JSON.parse(props.selectedRow.name).en
            : '',
        arDetails: props.selectedRow.details
            ? JSON.parse(props.selectedRow.details).ar
            : '',
        enDetails: props.selectedRow.details
            ? JSON.parse(props.selectedRow.details).en
            : '',
        image: props.selectedRow.image,
        price: props.selectedRow.price,
        calories: props.selectedRow.calories,
    }

    const handleFormSubmit = async (values: formTypes) => {
        const formdata = new FormData()
        formdata.append(
            'name',
            `{"ar":"${values.arName}" ,"en":"${values.enName}"}`
        )
        formdata.append(
            'details',
            `{"ar":"${values.arDetails}" ,"en":"${values.enDetails}"}`
        )
        formdata.append('price', `${values.price}`)
        formdata.append('calories', `${values.calories}`)
        formdata.append('active', 'true')
        formdata.append('categoryId', `${props.categoryId}`)
        if (values.image && typeof values.image != 'string') {
            formdata.append('image', values.image)
        }
        try {
            if (props.selectedRow.id) {
                const response = await apiUpdateProduct(
                    formdata,
                    props.selectedRow.id
                )
                if (response.status === 200) {
                    await props.getProduct()
                    props.onDialogeClose()
                    props.setSelectedRow()
                    toast.push(
                        <Notification
                            title={`${t('general.ok')}`}
                            type="success"
                        >
                            {t('edit-success')}.
                        </Notification>
                    )
                    setAvatarImg(null)
                }
            } else {
                const response = await apiCreateProduct(formdata)
                if (response.status === 201) {
                    await props.getProduct()
                    props.onDialogeClose()
                    props.setSelectedRow()
                    setAvatarImg(null)
                    toast.push(
                        <Notification
                            title={`${t('general.ok')}`}
                            type="success"
                        >
                            {t('general.create-success')}.
                        </Notification>
                    )
                }
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

    useEffect(() => {
        if (props.selectedRow.name) {
            setAvatarImg(appConfig.apiPrefix + '/' + props.selectedRow.image)
        }
    }, [props.selectedRow])

    return (
        <Dialog
            isOpen={props.dialogIsOpen}
            onClose={() => {
                props.onDialogeClose()
            }}
            onAfterClose={() => {
                setAvatarImg(null)
                props.setSelectedRow()
            }}
        >
            <h5 className="mb-4">
                {props.selectedRow.name ? t('general.edit') : t('general.add')}{' '}
                {t('products.product')}
            </h5>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values) =>
                    handleFormSubmit({ ...initialValues, ...values })
                }
            >
                {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                    return (
                        <Form>
                            <FormContainer className="flex flex-col items-center">
                                <div className="w-full h-[400px] overflow-auto px-1 ">
                                    <div className="w-full flex justify-center">
                                        <FormItem
                                            label={`${t(
                                                'products.product-image'
                                            )}`}
                                            invalid={
                                                errors.image && touched.image
                                            }
                                            errorMessage={errors.image}
                                        >
                                            <Field
                                                name="logo"
                                                placeholder={`${t(
                                                    'products.product-image-placeholder'
                                                )}`}
                                                className="w-full"
                                            >
                                                {({
                                                    field,
                                                    form,
                                                    meta,
                                                }: FieldProps) => (
                                                    <>
                                                        <Upload
                                                            className="cursor-pointer"
                                                            showList={false}
                                                            uploadLimit={1}
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            onChange={(file) =>
                                                                onFileUpload(
                                                                    file,
                                                                    setFieldValue
                                                                )
                                                            }
                                                        >
                                                            <Avatar
                                                                size={150}
                                                                src={
                                                                    avatarImg as string
                                                                }
                                                                icon={
                                                                    <HiOutlinePlus />
                                                                }
                                                            />
                                                        </Upload>
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
                                    <FormItem
                                        label={`${t('products.product-name')}`}
                                        htmlFor="arName"
                                        invalid={
                                            !!(errors.arName && touched.arName)
                                        }
                                        errorMessage={
                                            typeof errors.arName === 'string'
                                                ? errors.arName
                                                : undefined
                                        }
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="arName"
                                            id="arName"
                                            placeholder={`${t(
                                                'products.product-name'
                                            )}`}
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        htmlFor="enName"
                                        label={`${t(
                                            'products.product-name-en'
                                        )}`}
                                        invalid={
                                            !!(errors.enName && touched.enName)
                                        }
                                        errorMessage={
                                            typeof errors.enName === 'string'
                                                ? errors.enName
                                                : undefined
                                        }
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="enName"
                                            id="enName"
                                            placeholder={`${t(
                                                'products.product-name-en'
                                            )}`}
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        htmlFor="arDetails"
                                        label={`${t(
                                            'products.product-details'
                                        )}`}
                                        invalid={
                                            !!(
                                                errors.arDetails &&
                                                touched.arDetails
                                            )
                                        }
                                        errorMessage={
                                            typeof errors.arDetails === 'string'
                                                ? errors.arDetails
                                                : undefined
                                        }
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="arDetails"
                                            id="arDetails"
                                            textArea
                                            placeholder={`${t(
                                                'products.product-details'
                                            )}`}
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        htmlFor="enDetails"
                                        label={`${t(
                                            'products.product-details-en'
                                        )}`}
                                        invalid={
                                            !!(
                                                errors.enDetails &&
                                                touched.enDetails
                                            )
                                        }
                                        errorMessage={
                                            typeof errors.enDetails === 'string'
                                                ? errors.enDetails
                                                : undefined
                                        }
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="enDetails"
                                            id="enDetails"
                                            textArea
                                            placeholder={`${t(
                                                'products.product-details-en'
                                            )}`}
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        htmlFor="price"
                                        label={`${t('products.product-price')}`}
                                        invalid={errors.price && touched.price}
                                        errorMessage={errors.price}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name="price"
                                            id="price"
                                            placeholder={`${t(
                                                'products.product-price'
                                            )}`}
                                            component={Input}
                                            inputMode="numeric"
                                        />
                                    </FormItem>
                                    <FormItem
                                        htmlFor="calories"
                                        label={`${t(
                                            'products.product-calories'
                                        )}`}
                                        invalid={
                                            errors.calories && touched.calories
                                        }
                                        errorMessage={errors.calories}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name="calories"
                                            id="calories"
                                            component={Input}
                                            inputMode="numeric"
                                        />
                                    </FormItem>
                                </div>
                                <div className="w-full text-right mt-6">
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        loading={isSubmitting}
                                    >
                                        {props.selectedRow.id
                                            ? t('general.edit')
                                            : t('general.add')}
                                    </Button>
                                    <Button
                                        type="button"
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        disabled={isSubmitting}
                                        onClick={props.onDialogeClose}
                                    >
                                        {t('general.cancel')}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </Dialog>
    )
}

export default ProductDialog
