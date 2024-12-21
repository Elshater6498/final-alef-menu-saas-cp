import { Category } from '@/@types/category'
import {
    Button,
    Dialog,
    FormContainer,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import {
    apiCreateCategory,
    apiUpdateCategory,
} from '@/services/CategoryService'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

type Props = {
    dialogIsOpen: boolean
    onDialogeClose: () => void
    fetchCategories: () => Promise<void>
    selectedRow: Category
    setSelectedRow: () => void
}

const CategoryDialog = (props: Props) => {
    const { t } = useTranslation()
    const validationSchema = Yup.object().shape({
        arName: Yup.string().required(`${t('general.field-is-required')}`),
        enName: Yup.string().required(`${t('general.field-is-required')}`),
    })
    type nameForm = { arName: string; enName: string }
    const initialValues = {
        arName: props.selectedRow.name
            ? JSON.parse(props.selectedRow.name).ar
            : '',
        enName: props.selectedRow.name
            ? JSON.parse(props.selectedRow.name).en
            : '',
    }

    const handleFormSubmit = async (values: nameForm) => {
        const formdata = new FormData()
        formdata.append(
            'name',
            `{"ar":"${values.arName}" ,"en":"${values.enName}"}`
        )
        try {
            if (props.selectedRow.id) {
                const response = await apiUpdateCategory(
                    formdata,
                    props.selectedRow.id!
                )
                if (response.status === 200) {
                    await props.fetchCategories()
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
                }
            } else {
                const response = await apiCreateCategory(formdata)
                if (response.status === 201) {
                    await props.fetchCategories()
                    props.onDialogeClose()
                    props.setSelectedRow()
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

    return (
        <Dialog
            isOpen={props.dialogIsOpen}
            onClose={() => {
                props.onDialogeClose()
            }}
            onAfterClose={() => {
                props.setSelectedRow()
            }}
        >
            <h5 className="mb-4">
                {props.selectedRow.name ? t('general.edit') : t('general.add')}{' '}
                {t('categories.category')}
            </h5>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values) => handleFormSubmit(values)}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    return (
                        <Form>
                            <FormContainer className="flex flex-col items-center">
                                <FormItem
                                    className="w-full"
                                    label={`${t('categories.category-name')}`}
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
                                        placeholder={`${t(
                                            'categories.category-name'
                                        )}`}
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    className="w-full"
                                    label={`${t(
                                        'categories.category-name-en'
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
                                        type="text"
                                        autoComplete="off"
                                        name="enName"
                                        placeholder={`${t(
                                            'categories.category-name-en'
                                        )}`}
                                        component={Input}
                                    />
                                </FormItem>
                                <div className="w-full flex gap-2 items-center text-right mt-6">
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

export default CategoryDialog
