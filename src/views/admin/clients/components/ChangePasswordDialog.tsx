import { UserInfo } from '@/@types/userInfo'
import { PasswordInput } from '@/components/shared'
import { Button, Dialog, FormContainer, FormItem, Notification, toast } from '@/components/ui'
import { apiChangePassword, apiChangePasswordclient } from '@/services/AuthService'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'


type Props = {
    dialogIsOpen: boolean
    onDialogeClose: () => void
    selectedRow: UserInfo
}

const ChangePasswordDialog = ({ dialogIsOpen, onDialogeClose ,selectedRow}: Props) => {
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string().required(`${t('general.field-is-required')}`),
        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref('newPassword')],
                `${t('general.Password does not match')}`
            )
            .required(`${t('general.field-is-required')}`),
    })
    
    const handleFormSubmit = async (values: any) => {
        const form = new FormData();
        form.append('newPassword', values.newPassword)
        form.append('confirmPassword', values.confirmPassword)
        await apiChangePasswordclient(form ,selectedRow?.id!)
            .then((res) => {
                if (res.status === 200) {
                  onDialogeClose()
                    toast.push(
                        <Notification
                            title={`${t('general.ok')}`}
                            type="success"
                        >
                            {t('edit-success')}.
                        </Notification>
                    )
                }
            })
            .catch((err) => {
                    console.error(err)
                    toast.push(
                        <Notification
                            title={`${t('general.error')}`}
                            type="danger"
                        >
                            {t('general.error-message')}.
                        </Notification>
                    )
            })
    }

    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={() => {
                onDialogeClose()
            }}
        >
            <h5 className="mb-4">{t('general.change-password')}</h5>
            <Formik
                initialValues={{
                    newPassword: '',
                    confirmPassword: '',
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values) => handleFormSubmit(values)}
            >
                {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                    return (
                        <Form>
                            <FormContainer className="flex flex-col items-center">
                                <div className="w-full flex flex-col gap-2">
                                    <FormItem
                                        label={`${t('general.New password')}`}
                                        invalid={
                                            errors.newPassword &&
                                            touched.newPassword
                                        }
                                        errorMessage={errors.newPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="newPassword"
                                            placeholder={`${t(
                                                'general.New password'
                                            )}`}
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label={`${t(
                                            'general.Confirm the new password'
                                        )}`}
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder={`${t(
                                                'general.Confirm the new password'
                                            )}`}
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                </div>
                                <div className="w-full flex gap-4 justify-end">
                                    <Button
                                        type="submit"
                                        variant="solid"
                                        loading={isSubmitting}
                                    >
                                        {t('general.confirm')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="plain"
                                        disabled={isSubmitting}
                                        onClick={onDialogeClose}
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

export default ChangePasswordDialog
