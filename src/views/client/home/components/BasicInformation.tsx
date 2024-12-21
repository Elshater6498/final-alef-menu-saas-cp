import {
    Avatar,
    Button,
    FormContainer,
    FormItem,
    Input,
    Notification,
    Upload,
    toast,
} from '@/components/ui'
import appConfig from '@/configs/app.config'
import { useAppSelector } from '@/store'
import useRestaurant from '@/utils/hooks/useRestaurant'
import { Sketch } from '@uiw/react-color'
import { Field, FieldProps, Form, Formik, FormikErrors } from 'formik'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlinePlus } from 'react-icons/hi'
import PhoneInput from 'react-phone-input-2'
import * as Yup from 'yup'
import 'react-phone-input-2/lib/style.css'

type Restourantformtype = {
    name: string
    enName: string
    address: string
    enAddress: string
    image: string
    cover: string
    theme: string
    phone: string
    whatsapp: string
    entaxService: string
    taxService: string
    slogan: string
    enslogan: string
}

const BasicInformation = () => {
    const { t } = useTranslation()
    const { updateRestaurant } = useRestaurant()
    const restaurant = useAppSelector((state) => state.restaurant.restaurant)

    const validationSchema = Yup.object().shape({
        image: Yup.mixed().nullable(),
        cover: Yup.mixed().nullable(),
        name: Yup.string().required(`${t('general.field-is-required')}`),
        enName: Yup.string().required(`${t('general.field-is-required')}`),
        address: Yup.string(),
        enAddress: Yup.string(),
        theme: Yup.string(),
        whatsapp: Yup.string(),
        phone: Yup.string(),
        taxService: Yup.string(),
        entaxService: Yup.string(),
        slogan: Yup.string(),
        enslogan: Yup.string(),
    })

    const [colorHex, setColorHex] = useState('#fff')
    const [avatarImg, setAvatarImg] = useState<string | null>(null)
    const [cover, setcover] = useState<string | null>(null)

    // handel image
    const onFileUpload = async (
        files: File[],
        setFieldValue: (
            field: string,
            value: any,
            shouldValidate?: boolean | undefined
        ) => Promise<void | FormikErrors<{
            name: string
            enName: string
            image: null
        }>>
    ) => {
        if (files.length > 0) {
            setAvatarImg(URL.createObjectURL(files[0]))
            setFieldValue('image', files[0])
        }
    }
    const onFileUploadcover = async (
        files: File[],
        setFieldValue: (
            field: string,
            value: any,
            shouldValidate?: boolean | undefined
        ) => Promise<void | FormikErrors<{
            name: string
            enName: string
            image: null
        }>>
    ) => {
        if (files.length > 0) {
            setcover(URL.createObjectURL(files[0]))
            setFieldValue('cover', files[0])
        }
    }
    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }
        return valid
    }
    const beforeUploadcover = (files: FileList | null) => {
        let valid: string | boolean = true
        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }
        return valid
    }
    // handel image

    // handel submit
    const handleSubmit = async (values: Restourantformtype) => {
        const formData = new FormData()
        formData.append(
            'name',
            `{"ar":"${values.name}" ,"en":"${values.enName}"}`
        )
        formData.append(
            'address',
            `{"ar":"${values.address ?? ''}" ,"en":"${values.enAddress ?? ''}"}`
        )
        formData.append(
            'taxService',
            `{"ar":"${values.taxService ?? ''}" ,"en":"${
                values.entaxService ?? ''
            }"}`
        )
        formData.append(
            'slogan',
            `{"ar":"${values.slogan ?? ''}" ,"en":"${values.enslogan ?? ''}"}`
        )
        formData.append('phone', values.phone)
        formData.append('whatsapp', values.whatsapp)
        formData.append('theme', colorHex)

        if (values.image && typeof values.image != 'string') {
            formData.append('image', values.image!)
        }
        if (values.cover && typeof values.cover != 'string') {
            formData.append('cover', values.cover!)
        }
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
    // handel submit

    const restaurantInitialValues = {
        name: JSON.parse(restaurant.name!).ar as string,
        enName: JSON.parse(restaurant.name!).en as string,
        taxService: JSON.parse(restaurant.taxService! ?? '').ar
            ? (JSON.parse(restaurant.taxService! ?? '').ar as string)
            : '',
        entaxService: JSON.parse(restaurant.taxService! ?? '').en
            ? (JSON.parse(restaurant.taxService! ?? '').en as string)
            : '',
        slogan: JSON.parse(restaurant.slogan! ?? '').ar
            ? (JSON.parse(restaurant.slogan! ?? '').ar as string)
            : '',
        enslogan: JSON.parse(restaurant.slogan! ?? '').en
            ? (JSON.parse(restaurant.slogan! ?? '').en as string)
            : '',
        address: JSON.parse(restaurant.address!).ar as string,
        enAddress: JSON.parse(restaurant.address!).en as string,
        image: restaurant.image!,
        cover: restaurant.cover!,
        theme: restaurant.theme!,
        phone: restaurant.phone!,
        whatsapp: restaurant.whatsapp!,
    }

    useEffect(() => {
        setAvatarImg(appConfig.apiPrefix + restaurant.image!)
        setcover(appConfig.apiPrefix + restaurant.cover!)
        setColorHex(restaurant.theme!)
    }, [restaurant])

    return (
        <Formik
            initialValues={
                restaurant
                    ? restaurantInitialValues
                    : {
                          name: '',
                          enName: '',
                          address: '',
                          enAddress: '',
                          image: '',
                          cover: '',
                          theme: '',
                          phone: '',
                          whatsapp: '',
                          taxService: '',
                          entaxService: '',
                          slogan: '',
                          enslogan: '',
                      }
            }
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                return (
                    <Form>
                        <FormContainer>
                            <div className="max-w-4xl mx-auto">
                                <div className="relative mb-[100px]">
                                    <Field
                                        name="cover"
                                        placeholder="اختر صورة مناسبة"
                                        className="w-full"
                                    >
                                        {({
                                            field,
                                            form,
                                            meta,
                                        }: FieldProps) => (
                                            <>
                                                <Upload
                                                    className="cursor-pointer w-full h-full"
                                                    beforeUpload={
                                                        beforeUploadcover
                                                    }
                                                    onChange={(file) => {
                                                        onFileUploadcover(
                                                            file,
                                                            setFieldValue
                                                        )
                                                    }}
                                                    showList={false}
                                                    uploadLimit={1}
                                                >
                                                    <Avatar
                                                        className="w-full h-[300px]"
                                                        src={cover!}
                                                        icon={
                                                            <HiOutlinePlus className="" />
                                                        }
                                                    />
                                                </Upload>
                                                {meta.touched && meta.error && (
                                                    <div className="error">
                                                        {meta.error}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                    <Field
                                        name="image"
                                        placeholder="اختر صورة مناسبة"
                                        className="w-full"
                                    >
                                        {({
                                            field,
                                            form,
                                            meta,
                                        }: FieldProps) => (
                                            <>
                                                <Upload
                                                    className="absolute bottom-[-180px] ltr:left-4 rtl:right-4 cursor-pointer h-full"
                                                    beforeUpload={beforeUpload}
                                                    onChange={(file) => {
                                                        onFileUpload(
                                                            file,
                                                            setFieldValue
                                                        )
                                                    }}
                                                    showList={false}
                                                    uploadLimit={1}
                                                >
                                                    <Avatar
                                                        className="w-[200px] h-[200px] "
                                                        src={avatarImg!}
                                                        shape="circle"
                                                        icon={
                                                            <HiOutlinePlus className="" />
                                                        }
                                                    />
                                                </Upload>
                                                {meta.touched && meta.error && (
                                                    <div className="error">
                                                        {meta.error}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </Field>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.name-arabic'
                                        )}`}
                                        htmlFor="name"
                                        invalid={errors.name && touched.name}
                                        errorMessage={errors.name}
                                    >
                                        <Field
                                            dir="rtl"
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            id="name"
                                            placeholder="اسم المطعم"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.name-english'
                                        )}`}
                                        htmlFor="enName"
                                        invalid={
                                            errors.enName && touched.enName
                                        }
                                        errorMessage={errors.enName}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="enName"
                                            id="enName"
                                            placeholder="Restaurant name"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.Slogan-arabic'
                                        )}`}
                                        htmlFor="slogan"
                                        invalid={
                                            errors.slogan && touched.slogan
                                        }
                                        errorMessage={errors.slogan}
                                    >
                                        <Field
                                            dir="rtl"
                                            type="text"
                                            autoComplete="off"
                                            name="slogan"
                                            id="slogan"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.Slogan-english'
                                        )}`}
                                        htmlFor="enslogan"
                                        invalid={
                                            errors.enslogan && touched.enslogan
                                        }
                                        errorMessage={errors.enslogan}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="enslogan"
                                            id="enslogan"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.WhatsApp number'
                                        )}`}
                                        htmlFor="whatsapp"
                                        invalid={
                                            errors.whatsapp && touched.whatsapp
                                        }
                                        errorMessage={errors.whatsapp}
                                    >
                                        <Field name="whatsapp" dir={'ltr'}>
                                            {({ field, form }: FieldProps) => (
                                                <div dir={'ltr'}>
                                                    <PhoneInput
                                                        inputClass="!w-full md:flex-1 !h-11 !px-14 "
                                                        buttonClass="!w-11"
                                                        country={'sa'}
                                                        value={field.value}
                                                        onChange={(phone) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                phone
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.phone number'
                                        )}`}
                                        htmlFor="phone"
                                        invalid={errors.phone && touched.phone}
                                        errorMessage={errors.phone}
                                    >
                                        <Field name="phone">
                                            {({ field, form }: FieldProps) => (
                                                <div dir={'ltr'}>
                                                    <PhoneInput
                                                        inputClass="!w-full md:flex-1 !h-11 !px-14 "
                                                        buttonClass="!w-11"
                                                        country={'sa'}
                                                        value={field.value}
                                                        onChange={(phone) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                phone
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-3 ">
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.address-arabic'
                                        )}`}
                                        htmlFor="address"
                                        invalid={
                                            errors.address && touched.address
                                        }
                                        errorMessage={errors.address}
                                    >
                                        <Field
                                            dir="rtl"
                                            type="text"
                                            autoComplete="off"
                                            name="address"
                                            id="address"
                                            textArea
                                            rows={6}
                                            placeholder="عنوان المطعم"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        className="w-full md:flex-1"
                                        label={`${t(
                                            'client-home.identity-customization.address-english'
                                        )}`}
                                        htmlFor="enAddress"
                                        invalid={
                                            errors.enAddress &&
                                            touched.enAddress
                                        }
                                        errorMessage={errors.enAddress}
                                    >
                                        <Field
                                            dir="ltr"
                                            type="text"
                                            autoComplete="off"
                                            name="enAddress"
                                            id="enAddress"
                                            textArea
                                            rows={6}
                                            placeholder="Restaurant address"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                <div className="flex-1 flex  flex-col md:flex-row items-start gap-7">
                                    <FormItem
                                        label={`${t(
                                            'client-home.identity-customization.Primary color'
                                        )}`}
                                    >
                                        <Sketch
                                            id="theme"
                                            color={colorHex}
                                            disableAlpha={true}
                                            presetColors={false}
                                            onChange={(color) => {
                                                setColorHex(color.hexa)
                                                setFieldValue(
                                                    'theme',
                                                    color.hexa
                                                )
                                            }}
                                        />
                                    </FormItem>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <FormItem
                                            className="w-full md:flex-1"
                                            label={`${t(
                                                'client-home.identity-customization.Tax and service'
                                            )}`}
                                            htmlFor="taxService"
                                            invalid={
                                                errors.taxService &&
                                                touched.taxService
                                            }
                                            errorMessage={errors.taxService}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="taxService"
                                                id="taxService"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem
                                            className="w-full md:flex-1"
                                            label={`${t(
                                                'client-home.identity-customization.Tax and service en'
                                            )}`}
                                            htmlFor="entaxService"
                                            invalid={
                                                errors.entaxService &&
                                                touched.entaxService
                                            }
                                            errorMessage={errors.entaxService}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="entaxService"
                                                id="entaxService"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {t('client-home.Save data')}
                                    </Button>
                                </div>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default BasicInformation
